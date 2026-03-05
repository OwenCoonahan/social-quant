"""Social Quant — Twitter/LinkedIn Scraping via RapidAPI"""
import httpx
from typing import Optional, Dict, List
import json

class TwitterScraper:
    """Twitter data via RapidAPI. Supports multiple providers for easy swapping."""
    
    PROVIDERS = {
        "twitter-api45": {
            "base_url": "https://twitter-api45.p.rapidapi.com",
            "endpoints": {
                "user_info": "/screenname.php?screenname={handle}",
                "user_tweets": "/timeline.php?screenname={handle}&count={count}",
                "search": "/search.php?query={query}&search_type=Latest",
            },
        },
        "twitter154": {
            "base_url": "https://twitter154.p.rapidapi.com",
            "endpoints": {
                "user_info": "/user/details?username={handle}",
                "user_tweets": "/user/tweets?username={handle}&limit={count}",
                "search": "/search/search?query={query}&section=latest&limit={count}",
            },
        },
        "twitter241": {
            "base_url": "https://twitter241.p.rapidapi.com",
            "endpoints": {
                "user_info": "/user?username={handle}",
                "user_tweets": "/user-tweets?user={handle}&count={count}",
                "search": "/search?query={query}&type=Latest&count={count}",
            },
        },
    }
    
    def __init__(self, api_key: str, provider: str = "twitter-api45"):
        self.api_key = api_key
        self.provider = provider
        self.config = self.PROVIDERS.get(provider, self.PROVIDERS["twitter-api45"])
        self.headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": self.config["base_url"].split("//")[1],
        }
    
    async def get_user_info(self, handle: str) -> Optional[Dict]:
        url = self.config["base_url"] + self.config["endpoints"]["user_info"].format(handle=handle.lstrip("@"))
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            if resp.status_code == 200:
                return resp.json()
        return None
    
    async def get_user_tweets(self, handle: str, count: int = 20) -> List[Dict]:
        url = self.config["base_url"] + self.config["endpoints"]["user_tweets"].format(handle=handle.lstrip("@"), count=count)
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            if resp.status_code == 200:
                data = resp.json()
                # Normalize response based on provider
                return data if isinstance(data, list) else data.get("timeline", data.get("results", []))
        return []
    
    async def search(self, query: str, count: int = 20) -> List[Dict]:
        url = self.config["base_url"] + self.config["endpoints"]["search"].format(query=query, count=count)
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            if resp.status_code == 200:
                data = resp.json()
                return data if isinstance(data, list) else data.get("results", data.get("timeline", []))
        return []


class LinkedInScraper:
    """LinkedIn data via RapidAPI. Limited functionality — mostly profile data."""
    
    PROVIDERS = {
        "linkedin-data-api": {
            "base_url": "https://linkedin-data-api.p.rapidapi.com",
            "endpoints": {
                "profile": "/?username={handle}",
            },
        },
        "fresh-linkedin-profile-data": {
            "base_url": "https://fresh-linkedin-profile-data.p.rapidapi.com",
            "endpoints": {
                "profile": "/get-linkedin-profile?linkedin_url=https://linkedin.com/in/{handle}",
            },
        },
    }
    
    def __init__(self, api_key: str, provider: str = "linkedin-data-api"):
        self.api_key = api_key
        self.provider = provider
        self.config = self.PROVIDERS.get(provider, self.PROVIDERS["linkedin-data-api"])
        self.headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": self.config["base_url"].split("//")[1],
        }
    
    async def get_profile(self, handle: str) -> Optional[Dict]:
        url = self.config["base_url"] + self.config["endpoints"]["profile"].format(handle=handle)
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=self.headers)
            if resp.status_code == 200:
                return resp.json()
        return None
