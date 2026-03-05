"""Social Quant — FastAPI Backend"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
import json, os

from database import init_db, get_db
from models import Account, Post, SwipeFileEntry, MyPost, Draft, Settings
from scraper import TwitterScraper, LinkedInScraper

app = FastAPI(title="Social Quant API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    init_db()

# --- Accounts ---
@app.get("/api/accounts", response_model=List[Account])
async def list_accounts(platform: Optional[str] = None, category: Optional[str] = None):
    conn = get_db()
    query = "SELECT * FROM accounts WHERE 1=1"
    params = []
    if platform:
        query += " AND platform = ?"
        params.append(platform)
    if category:
        query += " AND category = ?"
        params.append(category)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/accounts")
async def add_account(account: Account):
    conn = get_db()
    conn.execute(
        "INSERT OR REPLACE INTO accounts (id, platform, handle, name, avatar, followers, followers_history, avg_engagement, post_frequency, category, bio, verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        (account.id, account.platform, account.handle, account.name, account.avatar, account.followers, json.dumps(account.followers_history), account.avg_engagement, account.post_frequency, account.category, account.bio, account.verified)
    )
    conn.commit()
    conn.close()
    return {"status": "ok", "id": account.id}

@app.delete("/api/accounts/{account_id}")
async def remove_account(account_id: str):
    conn = get_db()
    conn.execute("DELETE FROM accounts WHERE id = ?", (account_id,))
    conn.execute("DELETE FROM posts WHERE account_id = ?", (account_id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

# --- Posts ---
@app.get("/api/posts")
async def list_posts(platform: Optional[str] = None, account_id: Optional[str] = None, post_type: Optional[str] = None, sort: str = "timestamp", limit: int = 50):
    conn = get_db()
    query = "SELECT * FROM posts WHERE 1=1"
    params = []
    if platform:
        query += " AND platform = ?"
        params.append(platform)
    if account_id:
        query += " AND account_id = ?"
        params.append(account_id)
    if post_type:
        query += " AND type = ?"
        params.append(post_type)
    sort_map = {"timestamp": "timestamp DESC", "engagement": "engagement_rate DESC", "likes": "likes DESC", "bookmarks": "bookmarks DESC"}
    query += f" ORDER BY {sort_map.get(sort, 'timestamp DESC')} LIMIT ?"
    params.append(limit)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Scrape/Refresh ---
@app.post("/api/scrape/twitter/{handle}")
async def scrape_twitter(handle: str):
    conn = get_db()
    settings = {r["key"]: r["value"] for r in conn.execute("SELECT * FROM settings").fetchall()}
    conn.close()
    api_key = settings.get("rapid_api_key", "")
    provider = settings.get("twitter_api_provider", "twitter-api45")
    if not api_key:
        raise HTTPException(400, "RapidAPI key not configured. Set it in Settings.")
    scraper = TwitterScraper(api_key, provider)
    tweets = await scraper.get_user_tweets(handle)
    # TODO: normalize and store in DB
    return {"status": "ok", "count": len(tweets), "raw": tweets[:3]}

# --- Settings ---
@app.get("/api/settings")
async def get_settings():
    conn = get_db()
    rows = conn.execute("SELECT * FROM settings").fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}

@app.put("/api/settings")
async def update_settings(settings: dict):
    conn = get_db()
    for k, v in settings.items():
        conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, str(v)))
    conn.commit()
    conn.close()
    return {"status": "ok"}

# Serve static frontend
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..")
if os.path.exists(os.path.join(STATIC_DIR, "index.html")):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8420)
