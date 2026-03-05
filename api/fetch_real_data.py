#!/usr/bin/env python3
"""
Social Quant — Fetch Real Twitter Data via RapidAPI
Run manually or on a cron. Outputs data/real-data.json for the frontend.
"""
import httpx
import json
import os
import sys
import time
from datetime import datetime

RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY", "ae7e82eb92mshe228e4e78e2e694p1247f9jsn4679e7e34704")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "real-data.json")

# Accounts to fetch — match the frontend IDs
TWITTER_ACCOUNTS = [
    {"id": "t1", "handle": "GridStatusLive", "name": "Grid Status"},
    {"id": "t2", "handle": "EIAgov", "name": "U.S. EIA"},
    {"id": "t3", "handle": "SPGlobalPlatts", "name": "S&P Global Commodity Insights"},
    {"id": "t4", "handle": "JesseJenkins", "name": "Jesse Jenkins"},
    {"id": "t5", "handle": "TimMLatimer", "name": "Tim Latimer"},
    {"id": "t6", "handle": "levelsio", "name": "Pieter Levels"},
    {"id": "t7", "handle": "EnergyAtRisky", "name": "Energy at Risk"},
    {"id": "t8", "handle": "Solar_Rebecca", "name": "Rebecca Kujawa"},
    {"id": "t9", "handle": "GridBrief", "name": "Grid Brief"},
    {"id": "t10", "handle": "CleanAirTaskFrc", "name": "Clean Air Task Force"},
]

HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
}

BASE = "https://twitter-api45.p.rapidapi.com"


def fetch_user_info(client, handle):
    """Get user profile info."""
    try:
        r = client.get(f"{BASE}/screenname.php", params={"screenname": handle}, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"  [WARN] user_info {handle}: {e}")
    return None


def fetch_user_tweets(client, handle, count=10):
    """Get recent tweets for a user."""
    try:
        r = client.get(f"{BASE}/timeline.php", params={"screenname": handle, "count": str(count)}, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                return data
            return data.get("timeline", data.get("results", []))
    except Exception as e:
        print(f"  [WARN] tweets {handle}: {e}")
    return []


def normalize_tweet(tweet, account_id, handle):
    """Normalize a tweet from twitter-api45 into our frontend format."""
    # twitter-api45 returns varied shapes; be defensive
    text = tweet.get("text", tweet.get("full_text", tweet.get("content", "")))
    tweet_id = str(tweet.get("tweet_id", tweet.get("id", tweet.get("rest_id", ""))))
    
    # Metrics
    likes = int(tweet.get("favorites", tweet.get("favorite_count", tweet.get("likes", 0))) or 0)
    retweets = int(tweet.get("retweets", tweet.get("retweet_count", 0)) or 0)
    replies = int(tweet.get("replies", tweet.get("reply_count", 0)) or 0)
    bookmarks = int(tweet.get("bookmarks", tweet.get("bookmark_count", 0)) or 0)
    views = int(tweet.get("views", tweet.get("view_count", 0)) or 0)
    
    # Timestamp
    created = tweet.get("created_at", tweet.get("creation_date", ""))
    if created:
        try:
            # Try Twitter's format: "Mon Jan 01 00:00:00 +0000 2024"
            dt = datetime.strptime(created, "%a %b %d %H:%M:%S %z %Y")
            timestamp = dt.isoformat()
        except (ValueError, TypeError):
            timestamp = created if "T" in str(created) else datetime.now().isoformat()
    else:
        timestamp = datetime.now().isoformat()
    
    # Media
    media_urls = []
    media_type = "text"
    
    # Check various media locations
    media_entries = tweet.get("media", tweet.get("entities", {}).get("media", []))
    extended_media = tweet.get("extended_entities", {}).get("media", []) if isinstance(tweet.get("extended_entities"), dict) else []
    if extended_media:
        media_entries = extended_media
    
    if isinstance(media_entries, list):
        for m in media_entries:
            mtype = m.get("type", "photo")
            if mtype == "video" or mtype == "animated_gif":
                media_type = "video"
                # Get video thumbnail
                thumb = m.get("media_url_https", m.get("media_url", m.get("url", "")))
                if thumb:
                    media_urls.append({"type": "video", "thumbnail": thumb, "url": thumb})
            elif mtype == "photo":
                media_type = "image"
                url = m.get("media_url_https", m.get("media_url", m.get("url", "")))
                if url:
                    media_urls.append({"type": "image", "url": url})
    
    # Detect threads
    if tweet.get("is_thread") or tweet.get("self_thread"):
        post_type = "thread"
    elif media_type != "text":
        post_type = media_type
    else:
        post_type = "text"
    
    # Tweet URL
    tweet_url = f"https://x.com/{handle}/status/{tweet_id}" if tweet_id else ""
    
    # Engagement rate (estimate based on views or followers)
    total_eng = likes + retweets + replies + bookmarks
    if views and views > 0:
        eng_rate = round((total_eng / views) * 100, 2)
    else:
        eng_rate = 0
    
    return {
        "id": f"real_{tweet_id}",
        "accountId": account_id,
        "platform": "twitter",
        "content": text,
        "type": post_type,
        "likes": likes,
        "retweets": retweets,
        "replies": replies,
        "bookmarks": bookmarks,
        "views": views,
        "timestamp": timestamp,
        "engagementRate": eng_rate,
        "tweetUrl": tweet_url,
        "media": media_urls,
    }


def normalize_user(user_data, account):
    """Normalize user profile data."""
    if not user_data:
        return None
    # twitter-api45 user shape
    followers = int(user_data.get("sub_count", user_data.get("followers_count", user_data.get("followers", 0))) or 0)
    name = user_data.get("name", account["name"])
    bio = user_data.get("desc", user_data.get("description", ""))
    avatar_url = user_data.get("profile_pic", user_data.get("profile_image_url_https", ""))
    verified = bool(user_data.get("blue_verified", user_data.get("verified", False)))
    
    return {
        "id": account["id"],
        "handle": f"@{account['handle']}",
        "name": name,
        "followers": followers,
        "bio": bio,
        "avatarUrl": avatar_url,
        "verified": verified,
        "platform": "twitter",
    }


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Which accounts to fetch (default: first 5, or pass indices)
    indices = list(range(min(5, len(TWITTER_ACCOUNTS))))
    if len(sys.argv) > 1:
        if sys.argv[1] == "all":
            indices = list(range(len(TWITTER_ACCOUNTS)))
        else:
            indices = [int(x) for x in sys.argv[1:] if x.isdigit()]
    
    accounts_to_fetch = [TWITTER_ACCOUNTS[i] for i in indices if i < len(TWITTER_ACCOUNTS)]
    
    all_posts = []
    all_accounts = []
    
    with httpx.Client() as client:
        for acct in accounts_to_fetch:
            handle = acct["handle"]
            print(f"Fetching @{handle}...")
            
            # User info
            user = fetch_user_info(client, handle)
            normalized_user = normalize_user(user, acct)
            if normalized_user:
                all_accounts.append(normalized_user)
                print(f"  ✓ Profile: {normalized_user['followers']} followers")
            
            time.sleep(0.5)  # Rate limit courtesy
            
            # Tweets
            tweets = fetch_user_tweets(client, handle, count=10)
            print(f"  ✓ Got {len(tweets)} tweets")
            
            for t in tweets:
                post = normalize_tweet(t, acct["id"], handle)
                if post["content"]:  # Skip empty
                    all_posts.append(post)
            
            time.sleep(0.5)
    
    # Sort posts by timestamp descending
    all_posts.sort(key=lambda p: p.get("timestamp", ""), reverse=True)
    
    output = {
        "fetchedAt": datetime.now().isoformat(),
        "accounts": all_accounts,
        "posts": all_posts,
    }
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Saved {len(all_posts)} posts from {len(all_accounts)} accounts to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
