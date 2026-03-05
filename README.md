# ⚡ Social Quant — Prospector Labs

Bloomberg Terminal for social media intelligence. Track Twitter + LinkedIn accounts, analyze what content performs best, and inform your content strategy.

## Quick Start (Frontend Only)

No build step. Just open the HTML file:

```bash
open index.html
# or
python3 -m http.server 8420  # then visit http://localhost:8420
```

The frontend works standalone with realistic mock data — all filters, sorts, charts, and navigation are fully functional.

## Backend (Optional)

```bash
cd api
pip install -r requirements.txt
python server.py  # runs on http://localhost:8420
```

## Features

- **Dashboard** — Stats overview, top posts, content type breakdown, engagement charts
- **Account Tracking** — 10 Twitter + 4 LinkedIn accounts pre-loaded, sortable/filterable
- **Post Feed** — All posts with engagement metrics, filter by platform/type/account, sort by engagement/weighted/recency/bookmarks
- **Analytics** — Content type performance, best posting times, hook analysis, topic trends, platform comparison, algorithm weight reference
- **Swipe File** — Save inspiring posts with notes, "What's Working" pattern summaries
- **My Posts** — Track your own posts, goal tracking, draft workspace with char count
- **Settings** — API key configuration for RapidAPI Twitter/LinkedIn endpoints
- **Cmd+K Search** — Search across all posts and accounts

## Algorithm Weights (Built In)

The app calculates **weighted engagement** using Twitter's open-source algorithm weights:
- Repost: 20x
- Reply: 13.5x  
- Bookmark: 10x
- Like: 1x

## API Integration

Configure in Settings. Supports:
- **Twitter:** `twitter-api45`, `twitter154`, `twitter241` (via RapidAPI)
- **LinkedIn:** `linkedin-data-api`, `fresh-linkedin-profile-data` (via RapidAPI)

## Tech Stack

- Frontend: Vanilla HTML/CSS/JS, Chart.js
- Backend: Python FastAPI + SQLite
- Design: shadcn/ui aesthetic, dark mode default, Geist-inspired
- Fonts: Inter (via system stack)

## File Structure

```
social-quant/
├── index.html          Main app
├── css/styles.css      Styles (dark/light mode)
├── js/
│   ├── app.js          App logic, routing, state
│   ├── data.js         Seed/mock data (14 accounts, 30 posts)
│   ├── charts.js       Chart.js visualizations
│   └── utils.js        Helpers
├── api/
│   ├── server.py       FastAPI backend
│   ├── scraper.py      Twitter/LinkedIn scraping
│   ├── models.py       Pydantic data models
│   ├── database.py     SQLite setup
│   └── requirements.txt
└── README.md
```
