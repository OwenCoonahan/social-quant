"""Social Quant — Database Setup (SQLite)"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "social_quant.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            handle TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT,
            followers INTEGER DEFAULT 0,
            followers_history TEXT DEFAULT '[]',
            avg_engagement REAL DEFAULT 0.0,
            post_frequency REAL DEFAULT 0.0,
            category TEXT DEFAULT '',
            bio TEXT,
            verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            platform TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT DEFAULT 'text',
            likes INTEGER DEFAULT 0,
            retweets INTEGER DEFAULT 0,
            replies INTEGER DEFAULT 0,
            bookmarks INTEGER DEFAULT 0,
            engagement_rate REAL DEFAULT 0.0,
            timestamp TIMESTAMP,
            url TEXT,
            media_urls TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        );
        CREATE TABLE IF NOT EXISTS swipe_file (
            id TEXT PRIMARY KEY,
            post_id TEXT NOT NULL,
            notes TEXT DEFAULT '',
            tags TEXT DEFAULT '[]',
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id)
        );
        CREATE TABLE IF NOT EXISTS my_posts (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT DEFAULT 'text',
            likes INTEGER DEFAULT 0,
            retweets INTEGER DEFAULT 0,
            replies INTEGER DEFAULT 0,
            bookmarks INTEGER DEFAULT 0,
            engagement_rate REAL DEFAULT 0.0,
            timestamp TIMESTAMP,
            pillar TEXT,
            url TEXT
        );
        CREATE TABLE IF NOT EXISTS drafts (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            content TEXT NOT NULL,
            pillar TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_posts_account ON posts(account_id);
        CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
        CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts(timestamp);
    """)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized at", DB_PATH)
