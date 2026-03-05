"""Social Quant — Data Models"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Platform(str, Enum):
    TWITTER = "twitter"
    LINKEDIN = "linkedin"

class PostType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    THREAD = "thread"
    CAROUSEL = "carousel"
    POLL = "poll"

class Account(BaseModel):
    id: str
    platform: Platform
    handle: str
    name: str
    avatar: Optional[str] = None
    followers: int = 0
    followers_history: List[int] = []
    avg_engagement: float = 0.0
    post_frequency: float = 0.0
    category: str = ""
    bio: Optional[str] = None
    verified: bool = False
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class Post(BaseModel):
    id: str
    account_id: str
    platform: Platform
    content: str
    type: PostType = PostType.TEXT
    likes: int = 0
    retweets: int = 0
    replies: int = 0
    bookmarks: int = 0
    engagement_rate: float = 0.0
    timestamp: datetime
    url: Optional[str] = None
    media_urls: List[str] = []
    created_at: datetime = datetime.utcnow()

class SwipeFileEntry(BaseModel):
    id: str
    post_id: str
    notes: str = ""
    tags: List[str] = []
    saved_at: datetime = datetime.utcnow()

class MyPost(BaseModel):
    id: str
    platform: Platform
    content: str
    type: PostType = PostType.TEXT
    likes: int = 0
    retweets: int = 0
    replies: int = 0
    bookmarks: int = 0
    engagement_rate: float = 0.0
    timestamp: datetime
    pillar: Optional[str] = None
    url: Optional[str] = None

class Draft(BaseModel):
    id: str
    platform: Platform
    content: str
    pillar: Optional[str] = None
    created_at: datetime = datetime.utcnow()

class Settings(BaseModel):
    rapid_api_key: str = ""
    twitter_api_provider: str = "twitter-api45"
    linkedin_api_provider: str = "linkedin-data-api"
    refresh_interval: int = 30
