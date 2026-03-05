// Social Quant — Main Application Logic
// Single-page app with client-side routing and state management

const APP = {
  currentPage: 'dashboard',
  filters: {
    platform: 'all',
    account: 'all',
    postType: 'all',
    sortBy: 'engagement',
    dateRange: 'all',
  },
  swipeFile: [...MOCK_SWIPE_FILE],
  myPosts: [...MOCK_MY_POSTS],
  drafts: [...MOCK_DRAFTS],
  goals: { ...MOCK_GOALS },
  settings: { ...DEFAULT_SETTINGS },
  searchOpen: false,
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  navigateTo('dashboard');
  initSearch();
  initTheme();
});

// ===== NAVIGATION =====
function navigateTo(page) {
  APP.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  const main = document.getElementById('main-content');
  const header = document.getElementById('page-title');
  const headerActions = document.getElementById('header-actions');
  headerActions.innerHTML = '';
  
  const pages = {
    dashboard: { title: 'Dashboard', render: renderDashboard },
    accounts: { title: 'Tracked Accounts', render: renderAccounts },
    feed: { title: 'Post Feed', render: renderFeed },
    analytics: { title: 'Analytics', render: renderAnalytics },
    swipefile: { title: 'Swipe File', render: renderSwipeFile },
    myposts: { title: 'My Posts', render: renderMyPosts },
    settings: { title: 'Settings', render: renderSettings },
  };
  
  const p = pages[page];
  if (p) {
    header.textContent = p.title;
    main.innerHTML = '';
    p.render(main, headerActions);
  }
}

// ===== SIDEBAR =====
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  const items = [
    { page: 'dashboard', icon: '📊', label: 'Dashboard' },
    { page: 'accounts', icon: '👥', label: 'Accounts' },
    { page: 'feed', icon: '📰', label: 'Feed' },
    { page: 'analytics', icon: '📈', label: 'Analytics' },
    { divider: true },
    { page: 'swipefile', icon: '💾', label: 'Swipe File' },
    { page: 'myposts', icon: '✍️', label: 'My Posts' },
    { divider: true },
    { page: 'settings', icon: '⚙️', label: 'Settings' },
  ];
  nav.innerHTML = items.map(item => {
    if (item.divider) return '<div class="nav-divider"></div>';
    return `<div class="nav-item" data-page="${item.page}" onclick="navigateTo('${item.page}')">
      <span class="icon">${item.icon}</span>${item.label}
    </div>`;
  }).join('');
}

// ===== DASHBOARD =====
function renderDashboard(container, headerActions) {
  const twitterPosts = MOCK_POSTS.filter(p => p.platform === 'twitter');
  const linkedinPosts = MOCK_POSTS.filter(p => p.platform === 'linkedin');
  const allPosts = MOCK_POSTS;
  const totalEngagement = allPosts.reduce((s, p) => s + calcTotalEngagement(p), 0);
  const avgEng = (allPosts.reduce((s, p) => s + p.engagementRate, 0) / allPosts.length).toFixed(1);
  const topPost = [...allPosts].sort((a, b) => b.engagementRate - a.engagementRate)[0];
  
  container.innerHTML = `
    <div class="fade-in">
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-value">${ALL_ACCOUNTS.length}</div>
          <div class="stat-label">Tracked Accounts</div>
          <div class="stat-change up">↑ ${TWITTER_ACCOUNTS.length} Twitter · ${LINKEDIN_ACCOUNTS.length} LinkedIn</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${formatNumber(totalEngagement)}</div>
          <div class="stat-label">Total Engagement (All Posts)</div>
          <div class="stat-change up">↑ Likes + RTs + Replies + Bookmarks</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${avgEng}%</div>
          <div class="stat-label">Avg Engagement Rate</div>
          <div class="stat-change up">↑ Across all tracked posts</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${allPosts.length}</div>
          <div class="stat-label">Posts Tracked</div>
          <div class="stat-change">${twitterPosts.length} 𝕏 · ${linkedinPosts.length} LinkedIn</div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Content Type Performance</span></div>
          <div class="chart-container"><canvas id="chart-content-type"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Engagement Over Time</span></div>
          <div class="chart-container"><canvas id="chart-engagement-time"></canvas></div>
        </div>
      </div>
      
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <span class="card-title">🔥 Top Posts This Week</span>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('feed')">View All →</button>
        </div>
        <div class="top-posts-list" id="top-posts-dash"></div>
      </div>
      
      <div class="charts-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Platform Comparison</span></div>
          <div class="chart-container"><canvas id="chart-platform-compare"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Follower Growth (Top 5)</span></div>
          <div class="chart-container"><canvas id="chart-follower-growth"></canvas></div>
        </div>
      </div>
    </div>
  `;
  
  // Render top posts
  const topPosts = [...allPosts].sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5);
  document.getElementById('top-posts-dash').innerHTML = topPosts.map((p, i) => {
    const account = ALL_ACCOUNTS.find(a => a.id === p.accountId);
    return `<div class="top-post-item">
      <div class="top-post-rank">#${i + 1}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span class="platform-badge ${p.platform}">${getPlatformIcon(p.platform)}</span>
          <span style="font-size:12px;font-weight:600;">${account?.name || 'Unknown'}</span>
          <span style="font-size:11px;color:var(--text-muted)">${account?.handle}</span>
          <span class="post-type-badge">${getPostTypeIcon(p.type)} ${p.type}</span>
          <span style="font-size:11px;color:var(--text-muted);margin-left:auto">${formatDate(p.timestamp)}</span>
        </div>
        <div class="top-post-content">${escapeHtml(truncate(p.content, 180))}</div>
        <div class="top-post-stats">
          <span class="post-stat"><span class="icon">❤️</span><span class="value">${formatNumber(p.likes)}</span></span>
          <span class="post-stat"><span class="icon">🔁</span><span class="value">${formatNumber(p.retweets)}</span></span>
          <span class="post-stat"><span class="icon">💬</span><span class="value">${formatNumber(p.replies)}</span></span>
          <span class="post-stat"><span class="icon">🔖</span><span class="value">${formatNumber(p.bookmarks)}</span></span>
          <span class="post-engagement">${p.engagementRate}% eng</span>
        </div>
      </div>
    </div>`;
  }).join('');
  
  // Render charts
  setTimeout(() => {
    renderContentTypeChart('chart-content-type');
    renderEngagementOverTimeChart('chart-engagement-time');
    renderPlatformComparisonChart('chart-platform-compare');
    renderFollowerGrowthChart('chart-follower-growth');
  }, 50);
}

// ===== ACCOUNTS =====
function renderAccounts(container, headerActions) {
  headerActions.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;">
      <select class="feed-sort" id="account-sort" onchange="sortAccounts()">
        <option value="engagement">Sort: Engagement Rate</option>
        <option value="followers">Sort: Followers</option>
        <option value="growth">Sort: Growth Rate</option>
        <option value="name">Sort: Name</option>
      </select>
      <select class="feed-filter" id="account-platform-filter" onchange="sortAccounts()">
        <option value="all">All Platforms</option>
        <option value="twitter">Twitter</option>
        <option value="linkedin">LinkedIn</option>
      </select>
      <select class="feed-filter" id="account-category-filter" onchange="sortAccounts()">
        <option value="all">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
  `;
  container.innerHTML = '<div class="accounts-grid fade-in" id="accounts-grid"></div>';
  sortAccounts();
}

function sortAccounts() {
  const sort = document.getElementById('account-sort')?.value || 'engagement';
  const platform = document.getElementById('account-platform-filter')?.value || 'all';
  const category = document.getElementById('account-category-filter')?.value || 'all';
  
  let accounts = [...ALL_ACCOUNTS];
  if (platform !== 'all') accounts = accounts.filter(a => a.platform === platform);
  if (category !== 'all') accounts = accounts.filter(a => a.category === category);
  
  const sorters = {
    engagement: (a, b) => b.avgEngagement - a.avgEngagement,
    followers: (a, b) => b.followers - a.followers,
    growth: (a, b) => getGrowthRate(b.followersHistory) - getGrowthRate(a.followersHistory),
    name: (a, b) => a.name.localeCompare(b.name),
  };
  accounts.sort(sorters[sort] || sorters.engagement);
  
  const grid = document.getElementById('accounts-grid');
  grid.innerHTML = accounts.map(a => `
    <div class="card account-card" onclick="navigateTo('feed')">
      <div class="account-header">
        <div class="account-avatar">${a.avatar}</div>
        <div class="account-info">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="account-name">${a.name}</span>
            <span class="platform-badge ${a.platform}">${getPlatformIcon(a.platform)}</span>
          </div>
          <div class="account-handle">${a.handle}</div>
        </div>
        <span class="account-badge badge-${a.category}">${a.category}</span>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${a.bio || ''}</div>
      <div class="account-stats">
        <div class="account-stat">
          <div class="value">${formatNumber(a.followers)}</div>
          <div class="label">Followers</div>
        </div>
        <div class="account-stat">
          <div class="value">${a.avgEngagement}%</div>
          <div class="label">Avg Eng</div>
        </div>
        <div class="account-stat">
          <div class="value" style="color:var(--green)">+${getGrowthRate(a.followersHistory)}%</div>
          <div class="label">Growth</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== FEED =====
function renderFeed(container, headerActions) {
  headerActions.innerHTML = `
    <div class="feed-controls">
      <select class="feed-filter" id="feed-platform" onchange="filterFeed()">
        <option value="all">All Platforms</option>
        <option value="twitter">Twitter</option>
        <option value="linkedin">LinkedIn</option>
      </select>
      <select class="feed-filter" id="feed-account" onchange="filterFeed()">
        <option value="all">All Accounts</option>
        ${ALL_ACCOUNTS.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
      </select>
      <select class="feed-filter" id="feed-type" onchange="filterFeed()">
        <option value="all">All Types</option>
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="thread">Thread</option>
        <option value="video">Video</option>
        <option value="carousel">Carousel</option>
      </select>
      <select class="feed-sort" id="feed-sort" onchange="filterFeed()">
        <option value="engagement">Sort: Engagement Rate</option>
        <option value="total">Sort: Total Engagement</option>
        <option value="weighted">Sort: Weighted (Algorithm)</option>
        <option value="recency">Sort: Most Recent</option>
        <option value="bookmarks">Sort: Bookmarks</option>
      </select>
    </div>
  `;
  container.innerHTML = '<div class="fade-in" id="feed-list"></div>';
  filterFeed();
}

function filterFeed() {
  const platform = document.getElementById('feed-platform')?.value || 'all';
  const account = document.getElementById('feed-account')?.value || 'all';
  const type = document.getElementById('feed-type')?.value || 'all';
  const sort = document.getElementById('feed-sort')?.value || 'engagement';
  
  let posts = [...MOCK_POSTS];
  if (platform !== 'all') posts = posts.filter(p => p.platform === platform);
  if (account !== 'all') posts = posts.filter(p => p.accountId === account);
  if (type !== 'all') posts = posts.filter(p => p.type === type);
  
  const sorters = {
    engagement: (a, b) => b.engagementRate - a.engagementRate,
    total: (a, b) => calcTotalEngagement(b) - calcTotalEngagement(a),
    weighted: (a, b) => calcWeightedEngagement(b) - calcWeightedEngagement(a),
    recency: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    bookmarks: (a, b) => (b.bookmarks || 0) - (a.bookmarks || 0),
  };
  posts.sort(sorters[sort] || sorters.engagement);
  
  const list = document.getElementById('feed-list');
  list.innerHTML = posts.map(p => renderPostCard(p)).join('');
}

function renderPostCard(p) {
  const account = ALL_ACCOUNTS.find(a => a.id === p.accountId);
  const isSaved = APP.swipeFile.some(s => s.postId === p.id);
  return `<div class="card post-card">
    <div class="post-header">
      <div class="post-account">
        <div class="post-avatar">${account?.avatar || '?'}</div>
        <div class="post-meta">
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="name">${account?.name || 'Unknown'}</span>
            <span class="platform-badge ${p.platform}">${getPlatformIcon(p.platform)}</span>
          </div>
          <div class="handle">${account?.handle || ''}</div>
        </div>
      </div>
      <span class="post-type-badge">${getPostTypeIcon(p.type)} ${p.type}</span>
      <span class="post-time">${formatDate(p.timestamp)}</span>
    </div>
    <div class="post-content">${escapeHtml(p.content)}</div>
    <div class="post-stats">
      <span class="post-stat"><span class="icon">❤️</span><span class="value">${formatNumber(p.likes)}</span></span>
      <span class="post-stat"><span class="icon">🔁</span><span class="value">${formatNumber(p.retweets)}</span></span>
      <span class="post-stat"><span class="icon">💬</span><span class="value">${formatNumber(p.replies)}</span></span>
      <span class="post-stat"><span class="icon">🔖</span><span class="value">${formatNumber(p.bookmarks || 0)}</span></span>
      <span class="post-engagement">${p.engagementRate}% eng</span>
    </div>
    <div class="post-actions">
      <button class="post-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleSwipeFile('${p.id}')">
        ${isSaved ? '✓ Saved' : '💾 Save to Swipe File'}
      </button>
      <span style="margin-left:auto;font-size:10px;color:var(--text-muted);font-family:var(--font-mono);">
        Weighted: ${formatNumber(calcWeightedEngagement(p))} · Total: ${formatNumber(calcTotalEngagement(p))}
      </span>
    </div>
  </div>`;
}

function toggleSwipeFile(postId) {
  const idx = APP.swipeFile.findIndex(s => s.postId === postId);
  if (idx >= 0) {
    APP.swipeFile.splice(idx, 1);
  } else {
    APP.swipeFile.push({ id: 's' + Date.now(), postId, notes: '', tags: [], savedAt: new Date().toISOString() });
  }
  if (APP.currentPage === 'feed') filterFeed();
  if (APP.currentPage === 'swipefile') renderSwipeFile(document.getElementById('main-content'), document.getElementById('header-actions'));
}

// ===== ANALYTICS =====
function renderAnalytics(container) {
  container.innerHTML = `
    <div class="fade-in">
      <div class="charts-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">Content Type Breakdown</span></div>
          <div class="chart-container"><canvas id="analytics-content-type"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Best Posting Times</span></div>
          <div class="chart-container"><canvas id="analytics-posting-times"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Engagement Over Time</span></div>
          <div class="chart-container"><canvas id="analytics-engagement-time"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Platform Comparison</span></div>
          <div class="chart-container"><canvas id="analytics-platform"></canvas></div>
        </div>
      </div>
      
      <div class="analytics-section">
        <h3>🪝 Hook Analysis — Top Performing Openings</h3>
        <div class="hook-list">
          <div class="hook-item"><span class="hook-count">8 posts</span>"I analyzed/spent X hours..." — Data-driven research hooks</div>
          <div class="hook-item"><span class="hook-count">6 posts</span>"[Stat] + [Surprising context]" — Number-first surprise hooks</div>
          <div class="hook-item"><span class="hook-count">5 posts</span>"BREAKING/NEW:" — News-first urgency hooks</div>
          <div class="hook-item"><span class="hook-count">4 posts</span>"The [thing] nobody talks about" — Contrarian/hidden-truth hooks</div>
          <div class="hook-item"><span class="hook-count">3 posts</span>"I built a free tool..." — Build-in-public product hooks</div>
          <div class="hook-item"><span class="hook-count">3 posts</span>"Stop doing [X]" — Contrarian imperative hooks</div>
        </div>
      </div>
      
      <div class="analytics-section">
        <h3>🔑 Topic/Keyword Trends</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${[
            { word: 'interconnection', count: 8 }, { word: 'data centers', count: 6 }, { word: 'battery storage', count: 5 },
            { word: 'grid', count: 9 }, { word: 'solar', count: 6 }, { word: 'nuclear', count: 4 },
            { word: 'supply chain', count: 5 }, { word: 'IRA', count: 4 }, { word: 'ERCOT', count: 3 },
            { word: 'transformers', count: 3 }, { word: 'critical minerals', count: 4 }, { word: 'AI power', count: 5 },
            { word: 'copper', count: 2 }, { word: 'FERC', count: 3 }, { word: 'methane', count: 2 },
          ].map(t => `<span style="padding:6px 14px;border-radius:99px;background:var(--bg-secondary);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);">
            ${t.word} <span style="color:var(--green);font-family:var(--font-mono);font-weight:600;margin-left:4px;">${t.count}</span>
          </span>`).join('')}
        </div>
      </div>
      
      <div class="analytics-section">
        <h3>📏 Algorithm Weight Analysis</h3>
        <div class="card" style="padding:20px;">
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Twitter/X engagement value weights (from open-source code):</p>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius);">
              <div style="font-size:24px;font-weight:700;color:var(--green);font-family:var(--font-mono);">20x</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Repost</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius);">
              <div style="font-size:24px;font-weight:700;color:var(--blue);font-family:var(--font-mono);">13.5x</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Reply</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius);">
              <div style="font-size:24px;font-weight:700;color:var(--purple);font-family:var(--font-mono);">10x</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Bookmark</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius);">
              <div style="font-size:24px;font-weight:700;color:var(--text-muted);font-family:var(--font-mono);">1x</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Like</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    renderContentTypeChart('analytics-content-type');
    renderPostingTimesHeatmap('analytics-posting-times');
    renderEngagementOverTimeChart('analytics-engagement-time');
    renderPlatformComparisonChart('analytics-platform');
  }, 50);
}

// ===== SWIPE FILE =====
function renderSwipeFile(container) {
  const whatsWorking = `
    <div class="whats-working">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;">💡 What's Working This Week</h3>
      <div class="pattern-card">
        <div class="pattern-title">Data-first threads dominate</div>
        <div class="pattern-desc">Threads starting with "I analyzed X" or "I spent X hours" are getting 3x higher engagement than average. The key is specific numbers + surprising findings.</div>
      </div>
      <div class="pattern-card">
        <div class="pattern-title">Supply chain bottleneck content is hot</div>
        <div class="pattern-desc">Posts about transformers, interconnection delays, and critical minerals are consistently in the top 10%. "The thing nobody talks about" framing works especially well.</div>
      </div>
      <div class="pattern-card">
        <div class="pattern-title">Build-in-public with revenue numbers</div>
        <div class="pattern-desc">@levelsio-style posts sharing actual revenue and stack details are getting massive bookmarks. Apply this to Prospector Labs tool launches.</div>
      </div>
    </div>
  `;
  
  container.innerHTML = `
    <div class="fade-in">
      ${whatsWorking}
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;">📌 Saved Posts (${APP.swipeFile.length})</h3>
      <div class="swipe-grid" id="swipe-grid"></div>
      ${APP.swipeFile.length === 0 ? '<div class="empty-state"><div class="icon">💾</div><h3>No saved posts yet</h3><p>Save posts from the Feed to build your swipe file</p></div>' : ''}
    </div>
  `;
  
  const grid = document.getElementById('swipe-grid');
  if (grid) {
    grid.innerHTML = APP.swipeFile.map(s => {
      const post = MOCK_POSTS.find(p => p.id === s.postId);
      if (!post) return '';
      const account = ALL_ACCOUNTS.find(a => a.id === post.accountId);
      return `<div class="card swipe-card">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
          <span class="platform-badge ${post.platform}">${getPlatformIcon(post.platform)}</span>
          <span style="font-size:12px;font-weight:600;">${account?.name}</span>
          <span style="font-size:11px;color:var(--text-muted)">${account?.handle}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--text-muted)">Saved ${formatDate(s.savedAt)}</span>
        </div>
        <div class="post-content" style="font-size:12px;">${escapeHtml(truncate(post.content, 200))}</div>
        <div class="post-stats" style="border:none;padding:0;">
          <span class="post-stat"><span class="icon">❤️</span><span class="value">${formatNumber(post.likes)}</span></span>
          <span class="post-stat"><span class="icon">🔁</span><span class="value">${formatNumber(post.retweets)}</span></span>
          <span class="post-stat"><span class="icon">🔖</span><span class="value">${formatNumber(post.bookmarks)}</span></span>
          <span class="post-engagement">${post.engagementRate}%</span>
        </div>
        ${s.notes ? `<div class="notes">📝 ${escapeHtml(s.notes)}</div>` : ''}
        <div class="swipe-tags">${(s.tags || []).map(t => `<span class="swipe-tag">${t}</span>`).join('')}</div>
        <div style="margin-top:8px;"><button class="btn btn-danger btn-sm" onclick="toggleSwipeFile('${post.id}')">Remove</button></div>
      </div>`;
    }).join('');
  }
}

// ===== MY POSTS =====
function renderMyPosts(container) {
  const goals = APP.goals;
  
  container.innerHTML = `
    <div class="fade-in">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;">🎯 Weekly Goals</h3>
      <div class="goals-grid">
        ${Object.entries(goals).map(([key, g]) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          const cls = pct >= 70 ? 'on-track' : pct >= 40 ? 'behind' : 'critical';
          return `<div class="card goal-card">
            <div style="font-size:24px;font-weight:700;font-family:var(--font-mono);">${g.current}<span style="color:var(--text-muted);font-size:14px;">/${g.target}</span></div>
            <div class="stat-label">${g.label}</div>
            <div class="goal-progress-bar"><div class="goal-progress-fill ${cls}" style="width:${pct}%"></div></div>
          </div>`;
        }).join('')}
      </div>
      
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header"><span class="card-title">Performance Over Time</span></div>
        <div class="chart-container"><canvas id="chart-my-posts"></canvas></div>
      </div>
      
      <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;">📝 My Recent Posts</h3>
      <div id="my-posts-list">
        ${APP.myPosts.map(p => `<div class="card post-card">
          <div class="post-header">
            <div class="post-account">
              <div class="post-avatar">🧑‍💻</div>
              <div class="post-meta">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span class="name">Owen Coonahan</span>
                  <span class="platform-badge ${p.platform}">${getPlatformIcon(p.platform)}</span>
                  ${p.pillar ? `<span class="pillar-tag">${p.pillar}</span>` : ''}
                </div>
                <div class="handle">@ProspectorLabs</div>
              </div>
            </div>
            <span class="post-type-badge">${getPostTypeIcon(p.type)} ${p.type}</span>
            <span class="post-time">${formatDate(p.timestamp)}</span>
          </div>
          <div class="post-content">${escapeHtml(p.content)}</div>
          <div class="post-stats">
            <span class="post-stat"><span class="icon">❤️</span><span class="value">${formatNumber(p.likes)}</span></span>
            <span class="post-stat"><span class="icon">🔁</span><span class="value">${formatNumber(p.retweets)}</span></span>
            <span class="post-stat"><span class="icon">💬</span><span class="value">${formatNumber(p.replies)}</span></span>
            <span class="post-stat"><span class="icon">🔖</span><span class="value">${formatNumber(p.bookmarks)}</span></span>
            <span class="post-engagement">${p.engagementRate}% eng</span>
          </div>
        </div>`).join('')}
      </div>
      
      <h3 style="font-size:14px;font-weight:600;margin:24px 0 12px;">✏️ Draft Workspace</h3>
      <div class="draft-editor">
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <select class="feed-filter" id="draft-platform" style="padding-right:28px;">
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <select class="feed-filter" id="draft-pillar" style="padding-right:28px;">
            <option value="">No pillar</option>
            <option value="grid">Grid & Interconnection</option>
            <option value="minerals">Critical Minerals</option>
            <option value="AI+energy">AI + Energy</option>
            <option value="policy">Geopolitics & Policy</option>
            <option value="build-in-public">Build in Public</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </div>
        <textarea class="draft-textarea" id="draft-text" placeholder="Write your post here..." oninput="updateCharCount()"></textarea>
        <div class="draft-footer">
          <span class="char-count" id="char-count">0 / 280</span>
          <div class="draft-actions">
            <button class="btn btn-secondary btn-sm" onclick="saveDraft()">Save Draft</button>
          </div>
        </div>
      </div>
      
      ${APP.drafts.length > 0 ? `
        <h3 style="font-size:14px;font-weight:600;margin:16px 0 12px;">📋 Saved Drafts</h3>
        ${APP.drafts.map(d => `<div class="card" style="margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="platform-badge ${d.platform}">${getPlatformIcon(d.platform)}</span>
            ${d.pillar ? `<span class="pillar-tag">${d.pillar}</span>` : ''}
            <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">${d.content.length} chars</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);white-space:pre-wrap;">${escapeHtml(truncate(d.content, 200))}</div>
        </div>`).join('')}
      ` : ''}
    </div>
  `;
  
  setTimeout(() => renderMyPostsChart('chart-my-posts'), 50);
}

function updateCharCount() {
  const text = document.getElementById('draft-text')?.value || '';
  const platform = document.getElementById('draft-platform')?.value || 'twitter';
  const limit = platform === 'twitter' ? 280 : 3000;
  const counter = document.getElementById('char-count');
  if (counter) {
    counter.textContent = `${text.length} / ${limit}`;
    counter.classList.toggle('over', text.length > limit);
  }
}

function saveDraft() {
  const text = document.getElementById('draft-text')?.value;
  if (!text?.trim()) return;
  const platform = document.getElementById('draft-platform')?.value || 'twitter';
  const pillar = document.getElementById('draft-pillar')?.value || '';
  APP.drafts.unshift({ id: 'd' + Date.now(), platform, content: text, pillar, createdAt: new Date().toISOString() });
  document.getElementById('draft-text').value = '';
  updateCharCount();
  renderMyPosts(document.getElementById('main-content'));
}

// ===== SETTINGS =====
function renderSettings(container) {
  container.innerHTML = `
    <div class="fade-in">
      <div class="settings-section">
        <h3>🔑 API Configuration</h3>
        <div class="setting-row">
          <div class="setting-label">RapidAPI Key<div class="desc">Master key for all RapidAPI endpoints</div></div>
          <input class="setting-input" type="password" placeholder="Enter RapidAPI key..." value="${APP.settings.rapidApiKey}" onchange="APP.settings.rapidApiKey=this.value">
        </div>
        <div class="setting-row">
          <div class="setting-label">Twitter API Provider<div class="desc">RapidAPI endpoint to use for Twitter data</div></div>
          <select class="setting-input" style="appearance:auto;font-family:var(--font);" onchange="APP.settings.twitterApiProvider=this.value">
            <option value="twitter-api45" ${APP.settings.twitterApiProvider === 'twitter-api45' ? 'selected' : ''}>twitter-api45</option>
            <option value="twitter154" ${APP.settings.twitterApiProvider === 'twitter154' ? 'selected' : ''}>twitter154</option>
            <option value="twitter241" ${APP.settings.twitterApiProvider === 'twitter241' ? 'selected' : ''}>twitter241</option>
          </select>
        </div>
        <div class="setting-row">
          <div class="setting-label">LinkedIn API Provider<div class="desc">RapidAPI endpoint for LinkedIn (limited availability)</div></div>
          <select class="setting-input" style="appearance:auto;font-family:var(--font);" onchange="APP.settings.linkedinApiProvider=this.value">
            <option value="linkedin-data-api" ${APP.settings.linkedinApiProvider === 'linkedin-data-api' ? 'selected' : ''}>linkedin-data-api</option>
            <option value="fresh-linkedin-profile-data" ${APP.settings.linkedinApiProvider === 'fresh-linkedin-profile-data' ? 'selected' : ''}>fresh-linkedin-profile-data</option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h3>⚙️ App Settings</h3>
        <div class="setting-row">
          <div class="setting-label">Auto-refresh Interval<div class="desc">How often to fetch new data (minutes)</div></div>
          <input class="setting-input" type="number" min="5" max="120" value="${APP.settings.refreshInterval}" onchange="APP.settings.refreshInterval=parseInt(this.value)" style="width:100px;">
        </div>
      </div>
      
      <div class="settings-section">
        <h3>📋 API Integration Notes</h3>
        <div class="card" style="font-size:12px;color:var(--text-secondary);line-height:1.8;">
          <p><strong>Twitter (via RapidAPI):</strong></p>
          <ul style="margin-left:16px;margin-bottom:12px;">
            <li><code>twitter-api45</code> — User timeline, search, user info. Good for scraping recent tweets.</li>
            <li><code>twitter154</code> — Tweet details, user followers, trending topics.</li>
            <li><code>twitter241</code> — Advanced search, user tweets, tweet engagement data.</li>
          </ul>
          <p><strong>LinkedIn (via RapidAPI):</strong></p>
          <ul style="margin-left:16px;margin-bottom:12px;">
            <li><code>linkedin-data-api</code> — Profile data, company info. Limited post data.</li>
            <li><code>fresh-linkedin-profile-data</code> — Profile scraping, activity feed (inconsistent).</li>
          </ul>
          <p style="color:var(--text-muted);margin-top:8px;">⚠️ LinkedIn scraping is unreliable. Use mock data for now and connect APIs when available.</p>
        </div>
      </div>
    </div>
  `;
}

// ===== SEARCH (Cmd+K) =====
function initSearch() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearch();
    }
    if (e.key === 'Escape' && APP.searchOpen) toggleSearch();
  });
}

function toggleSearch() {
  APP.searchOpen = !APP.searchOpen;
  const overlay = document.getElementById('search-overlay');
  overlay.classList.toggle('open', APP.searchOpen);
  if (APP.searchOpen) {
    const input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    document.getElementById('search-results').innerHTML = '<div class="search-empty">Type to search posts and accounts...</div>';
  }
}

function onSearchInput(e) {
  const query = e.target.value.trim();
  const results = document.getElementById('search-results');
  if (!query) {
    results.innerHTML = '<div class="search-empty">Type to search posts and accounts...</div>';
    return;
  }
  const { accounts, posts } = searchAll(query);
  let html = '';
  if (accounts.length) {
    html += accounts.slice(0, 5).map(a => `
      <div class="search-result-item" onclick="toggleSearch();navigateTo('accounts');">
        <div class="label">${getPlatformIcon(a.platform)} Account</div>
        <div class="title">${a.avatar} ${a.name} <span style="color:var(--text-muted)">${a.handle}</span></div>
      </div>
    `).join('');
  }
  if (posts.length) {
    html += posts.slice(0, 8).map(p => {
      const account = ALL_ACCOUNTS.find(a => a.id === p.accountId);
      return `<div class="search-result-item" onclick="toggleSearch();navigateTo('feed');">
        <div class="label">${getPlatformIcon(p.platform)} Post by ${account?.name || 'Unknown'}</div>
        <div class="title">${truncate(p.content, 100)}</div>
      </div>`;
    }).join('');
  }
  if (!html) html = '<div class="search-empty">No results found</div>';
  results.innerHTML = html;
}

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('sq-theme');
  if (saved === 'light') document.body.classList.add('light-mode');
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('sq-theme', isLight ? 'light' : 'dark');
  // Re-render current page to update charts
  navigateTo(APP.currentPage);
}
