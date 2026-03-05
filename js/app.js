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
    topicbank: { title: 'Topic Bank', render: renderTopicBank },
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
    { page: 'topicbank', icon: '💡', label: 'Topics' },
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
    const tweetUrl = p.tweetUrl || '';
    return `<div class="top-post-item">
      <div class="top-post-rank">#${i + 1}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          ${account?.avatarUrl ? `<img src="${account.avatarUrl}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;">` : ''}
          <span class="platform-badge ${p.platform}">${getPlatformIcon(p.platform)}</span>
          <span style="font-size:12px;font-weight:600;">${account?.name || 'Unknown'}</span>
          <span style="font-size:11px;color:var(--text-muted)">${account?.handle}</span>
          <span class="post-type-badge">${getPostTypeIcon(p.type)} ${p.type}</span>
          ${tweetUrl ? `<a href="${tweetUrl}" target="_blank" style="font-size:10px;color:var(--blue);margin-left:4px;">↗</a>` : ''}
          <span style="font-size:11px;color:var(--text-muted);margin-left:auto">${formatDate(p.timestamp)}</span>
        </div>
        <div class="top-post-content">${escapeHtml(truncate(p.content, 180))}</div>
        ${p.media?.length ? `<div style="display:flex;gap:4px;margin:4px 0;">${p.media.slice(0,2).map(m => `<img src="${m.url || m.thumbnail}" style="height:48px;border-radius:4px;object-fit:cover;" onerror="this.style.display='none'">`).join('')}</div>` : ''}
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
  const avatarDisplay = account?.avatarUrl
    ? `<img src="${account.avatarUrl}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" onerror="this.outerHTML='<div class=post-avatar>${account?.avatar || '?'}</div>'">`
    : `<div class="post-avatar">${account?.avatar || '?'}</div>`;

  // Media rendering
  let mediaHtml = '';
  if (p.media && p.media.length > 0) {
    const mediaItems = p.media.slice(0, 4).map(m => {
      if (m.type === 'video') {
        return `<div class="post-media-item post-media-video" onclick="window.open('${p.tweetUrl || '#'}','_blank')">
          <img src="${m.thumbnail || m.url}" alt="Video thumbnail" loading="lazy" onerror="this.parentElement.style.display='none'">
          <div class="post-media-play">▶</div>
        </div>`;
      }
      return `<div class="post-media-item">
        <img src="${m.url}" alt="Post media" loading="lazy" onerror="this.parentElement.style.display='none'">
      </div>`;
    }).join('');
    mediaHtml = `<div class="post-media-grid post-media-${Math.min(p.media.length, 4)}">${mediaItems}</div>`;
  }

  // Tweet URL
  const tweetUrl = p.tweetUrl || (p.platform === 'twitter' && account ? `https://x.com/${account.handle?.replace('@','')}` : '');
  const linkUrl = p.linkUrl || tweetUrl;
  const viewOriginal = linkUrl ? `<a href="${linkUrl}" target="_blank" rel="noopener" class="post-action-btn view-original">↗ View Original</a>` : '';

  return `<div class="card post-card">
    <div class="post-header">
      <div class="post-account">
        ${avatarDisplay}
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
    ${mediaHtml}
    <div class="post-stats">
      <span class="post-stat"><span class="icon">❤️</span><span class="value">${formatNumber(p.likes)}</span></span>
      <span class="post-stat"><span class="icon">🔁</span><span class="value">${formatNumber(p.retweets)}</span></span>
      <span class="post-stat"><span class="icon">💬</span><span class="value">${formatNumber(p.replies)}</span></span>
      <span class="post-stat"><span class="icon">🔖</span><span class="value">${formatNumber(p.bookmarks || 0)}</span></span>
      ${p.views ? `<span class="post-stat"><span class="icon">👁️</span><span class="value">${formatNumber(p.views)}</span></span>` : ''}
      <span class="post-engagement">${p.engagementRate}% eng</span>
    </div>
    <div class="post-actions">
      <button class="post-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleSwipeFile('${p.id}')">
        ${isSaved ? '✓ Saved' : '💾 Save to Swipe File'}
      </button>
      ${viewOriginal}
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
            <button class="btn btn-primary btn-sm" onclick="showBufferModal(document.getElementById('draft-text')?.value || '')">📤 Schedule via Buffer</button>
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

// ===== TOPIC BANK =====
let topicBankState = { expanded: null, draftTopicId: null };

function renderTopicBank(container, headerActions) {
  headerActions.innerHTML = `
    <div class="feed-controls">
      <select class="feed-filter" id="topic-status-filter" onchange="filterTopics()">
        <option value="all">All Statuses</option>
        ${TOPIC_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
      <select class="feed-filter" id="topic-pillar-filter" onchange="filterTopics()">
        <option value="all">All Pillars</option>
        ${PILLARS.map(p => `<option value="${p}">${p}</option>`).join('')}
      </select>
      <select class="feed-filter" id="topic-platform-filter" onchange="filterTopics()">
        <option value="all">All Platforms</option>
        <option value="twitter">Twitter</option>
        <option value="linkedin">LinkedIn</option>
        <option value="Both">Both</option>
      </select>
      <select class="feed-filter" id="topic-level-filter" onchange="filterTopics()">
        <option value="all">All Levels</option>
        ${POST_LEVELS.map(l => `<option value="${l}">${l}</option>`).join('')}
      </select>
      <select class="feed-filter" id="topic-type-filter" onchange="filterTopics()">
        <option value="all">All Types</option>
        ${TOPIC_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" onclick="toggleQuickAdd()">+ Add Topic</button>
    </div>
  `;
  container.innerHTML = `
    <div class="fade-in">
      <div id="quick-add-form" style="display:none;margin-bottom:20px;">
        <div class="card">
          <h3 style="font-size:14px;font-weight:600;margin-bottom:12px;">➕ Quick Add Topic</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="modal-field"><label>Title</label><input id="qa-title" placeholder="Topic title..."></div>
            <div class="modal-field"><label>Platform</label>
              <select id="qa-platform"><option value="Both">Both</option><option value="twitter">Twitter</option><option value="linkedin">LinkedIn</option></select>
            </div>
            <div class="modal-field" style="grid-column:span 2;"><label>Description / Angle</label><input id="qa-desc" placeholder="1-2 sentence angle..."></div>
            <div class="modal-field"><label>Pillar</label>
              <select id="qa-pillar">${PILLARS.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
            </div>
            <div class="modal-field"><label>Level</label>
              <select id="qa-level">${POST_LEVELS.map(l => `<option value="${l}">${l}</option>`).join('')}</select>
            </div>
            <div class="modal-field"><label>Type</label>
              <select id="qa-type">${TOPIC_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}</select>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="btn btn-primary btn-sm" onclick="addTopic()">Add Topic</button>
            <button class="btn btn-ghost btn-sm" onclick="toggleQuickAdd()">Cancel</button>
          </div>
        </div>
      </div>
      <div class="stats-grid" style="margin-bottom:20px;">
        <div class="card stat-card"><div class="stat-value">${MOCK_TOPICS.length}</div><div class="stat-label">Total Topics</div></div>
        <div class="card stat-card"><div class="stat-value">${MOCK_TOPICS.filter(t=>t.status==='💡 Idea').length}</div><div class="stat-label">Ideas</div></div>
        <div class="card stat-card"><div class="stat-value">${MOCK_TOPICS.filter(t=>t.status==='✍️ Drafting').length}</div><div class="stat-label">Drafting</div></div>
        <div class="card stat-card"><div class="stat-value">${MOCK_TOPICS.filter(t=>t.status==='✅ Posted').length}</div><div class="stat-label">Posted</div></div>
      </div>
      <div id="topic-list"></div>
    </div>
  `;
  filterTopics();
}

function toggleQuickAdd() {
  const form = document.getElementById('quick-add-form');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addTopic() {
  const title = document.getElementById('qa-title')?.value?.trim();
  const desc = document.getElementById('qa-desc')?.value?.trim();
  if (!title) return;
  MOCK_TOPICS.unshift({
    id: 'topic' + Date.now(),
    title,
    description: desc || '',
    platform: document.getElementById('qa-platform')?.value || 'Both',
    pillar: document.getElementById('qa-pillar')?.value || 'Grid',
    level: document.getElementById('qa-level')?.value || 'L2',
    type: document.getElementById('qa-type')?.value || 'hot take',
    status: '💡 Idea',
    createdAt: new Date().toISOString(),
    examples: [],
  });
  toggleQuickAdd();
  renderTopicBank(document.getElementById('main-content'), document.getElementById('header-actions'));
}

function filterTopics() {
  const status = document.getElementById('topic-status-filter')?.value || 'all';
  const pillar = document.getElementById('topic-pillar-filter')?.value || 'all';
  const platform = document.getElementById('topic-platform-filter')?.value || 'all';
  const level = document.getElementById('topic-level-filter')?.value || 'all';
  const type = document.getElementById('topic-type-filter')?.value || 'all';

  let topics = [...MOCK_TOPICS];
  if (status !== 'all') topics = topics.filter(t => t.status === status);
  if (pillar !== 'all') topics = topics.filter(t => t.pillar === pillar);
  if (platform !== 'all') topics = topics.filter(t => t.platform === platform);
  if (level !== 'all') topics = topics.filter(t => t.level === level);
  if (type !== 'all') topics = topics.filter(t => t.type === type);

  const list = document.getElementById('topic-list');
  if (!list) return;
  list.innerHTML = topics.map(t => renderTopicCard(t)).join('');
}

function renderTopicCard(t) {
  const isExpanded = topicBankState.expanded === t.id;
  const isDrafting = topicBankState.draftTopicId === t.id;
  const statusColors = { '💡 Idea': 'var(--yellow)', '✍️ Drafting': 'var(--blue)', '✅ Posted': 'var(--green)' };
  const pillarBadge = `badge-${t.pillar.toLowerCase().replace(/[+&\s]/g, match => match === '+' ? '\\+' : match === '&' ? '' : '-')}`;

  return `<div class="card" style="margin-bottom:12px;border-left:3px solid ${statusColors[t.status] || 'var(--border)'};">
    <div style="cursor:pointer;" onclick="toggleTopicExpand('${t.id}')">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span style="font-size:14px;font-weight:600;flex:1;min-width:200px;">${escapeHtml(t.title)}</span>
        <span style="font-size:11px;padding:2px 8px;border-radius:99px;background:${statusColors[t.status]}20;color:${statusColors[t.status]};font-weight:600;">${t.status}</span>
        <span class="account-badge badge-${t.pillar.toLowerCase()}" style="font-size:10px;">${t.pillar}</span>
        <span class="post-type-badge">${t.level}</span>
        <span class="post-type-badge">${t.type}</span>
        <span class="platform-badge ${t.platform === 'Both' ? 'twitter' : t.platform}" style="font-size:10px;">${t.platform === 'Both' ? '𝕏+in' : getPlatformIcon(t.platform)}</span>
        <span style="font-size:11px;color:var(--text-muted);">${formatDate(t.createdAt)}</span>
      </div>
      <p style="font-size:12px;color:var(--text-secondary);margin-top:6px;">${escapeHtml(t.description)}</p>
    </div>
    ${isExpanded ? renderTopicExpanded(t, isDrafting) : ''}
  </div>`;
}

function renderTopicExpanded(t, isDrafting) {
  const examplesHtml = (t.examples || []).map((ex, i) => `
    <div style="padding:12px;background:var(--bg-tertiary);border-radius:var(--radius);margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span class="platform-badge ${ex.platform}">${getPlatformIcon(ex.platform)}</span>
        <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">${ex.label}</span>
        <button class="btn btn-ghost btn-sm" style="margin-left:auto;font-size:10px;" onclick="event.stopPropagation();prefillDraft('${t.id}',${i})">Use as Draft →</button>
      </div>
      <div style="font-size:12px;color:var(--text-primary);white-space:pre-wrap;line-height:1.6;">${escapeHtml(ex.content)}</div>
    </div>
  `).join('');

  return `
    <div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px;" onclick="event.stopPropagation()">
      ${t.examples.length > 0 ? `<h4 style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Example Posts (${t.examples.length})</h4>${examplesHtml}` : '<p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">No example posts yet.</p>'}
      
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="openTopicDraft('${t.id}')">✏️ Write Post</button>
        <button class="btn btn-secondary btn-sm" onclick="cycleTopicStatus('${t.id}')">Cycle Status →</button>
        <div style="margin-left:auto;display:flex;gap:6px;">
          ${TOPIC_STATUSES.map(s => `<button class="btn btn-ghost btn-sm" style="font-size:10px;${t.status===s?'color:var(--green);':''}" onclick="setTopicStatus('${t.id}','${s}')">${s}</button>`).join('')}
        </div>
      </div>

      ${isDrafting ? renderTopicDraftWorkspace(t) : ''}
    </div>
  `;
}

function renderTopicDraftWorkspace(t) {
  const draftId = `topic-draft-${t.id}`;
  return `
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
      <h4 style="font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">✏️ Draft Workspace — ${escapeHtml(t.title)}</h4>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <select class="feed-filter" id="${draftId}-platform" onchange="updateTopicDraftCount('${t.id}')" style="padding-right:28px;">
          <option value="twitter" ${t.platform==='twitter'?'selected':''}>Twitter (280 chars)</option>
          <option value="linkedin" ${t.platform==='linkedin'?'selected':''}>LinkedIn (3000 chars)</option>
        </select>
        <span class="pillar-tag">${t.pillar}</span>
        <span class="post-type-badge">${t.level} · ${t.type}</span>
      </div>
      <textarea class="draft-textarea" id="${draftId}-text" placeholder="Write your post about: ${escapeHtml(t.title)}..." oninput="updateTopicDraftCount('${t.id}')" style="min-height:140px;"></textarea>
      <div class="draft-footer">
        <span class="char-count" id="${draftId}-count">0 / 280</span>
        <div class="draft-actions">
          <button class="btn btn-secondary btn-sm" onclick="saveTopicDraft('${t.id}')">💾 Save Draft</button>
          <button class="btn btn-primary btn-sm" onclick="showBufferModal(document.getElementById('topic-draft-${t.id}-text')?.value || '')">📤 Buffer</button>
          <button class="btn btn-primary btn-sm" onclick="markTopicPosted('${t.id}')">✅ Mark as Posted</button>
          <button class="btn btn-ghost btn-sm" onclick="closeTopicDraft('${t.id}')">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function toggleTopicExpand(id) {
  topicBankState.expanded = topicBankState.expanded === id ? null : id;
  topicBankState.draftTopicId = null;
  filterTopics();
}

function openTopicDraft(id) {
  topicBankState.draftTopicId = id;
  filterTopics();
  // scroll to draft area
  setTimeout(() => {
    const el = document.getElementById(`topic-draft-${id}-text`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
  }, 50);
}

function closeTopicDraft(id) {
  topicBankState.draftTopicId = null;
  filterTopics();
}

function prefillDraft(topicId, exampleIdx) {
  const topic = MOCK_TOPICS.find(t => t.id === topicId);
  if (!topic || !topic.examples[exampleIdx]) return;
  topicBankState.draftTopicId = topicId;
  filterTopics();
  setTimeout(() => {
    const ex = topic.examples[exampleIdx];
    const textarea = document.getElementById(`topic-draft-${topicId}-text`);
    const platformSelect = document.getElementById(`topic-draft-${topicId}-platform`);
    if (textarea) textarea.value = ex.content;
    if (platformSelect) platformSelect.value = ex.platform;
    updateTopicDraftCount(topicId);
    textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textarea?.focus();
  }, 50);
}

function updateTopicDraftCount(topicId) {
  const draftId = `topic-draft-${topicId}`;
  const text = document.getElementById(`${draftId}-text`)?.value || '';
  const platform = document.getElementById(`${draftId}-platform`)?.value || 'twitter';
  const limit = platform === 'twitter' ? 280 : 3000;
  const counter = document.getElementById(`${draftId}-count`);
  if (counter) {
    counter.textContent = `${text.length} / ${limit}`;
    counter.classList.toggle('over', text.length > limit);
  }
}

function saveTopicDraft(topicId) {
  const draftId = `topic-draft-${topicId}`;
  const text = document.getElementById(`${draftId}-text`)?.value?.trim();
  if (!text) return;
  const platform = document.getElementById(`${draftId}-platform`)?.value || 'twitter';
  const topic = MOCK_TOPICS.find(t => t.id === topicId);
  APP.drafts.unshift({
    id: 'd' + Date.now(),
    platform,
    content: text,
    pillar: topic?.pillar || '',
    createdAt: new Date().toISOString(),
  });
  // Update topic status to drafting
  if (topic && topic.status === '💡 Idea') topic.status = '✍️ Drafting';
  topicBankState.draftTopicId = null;
  filterTopics();
}

function markTopicPosted(topicId) {
  const topic = MOCK_TOPICS.find(t => t.id === topicId);
  if (topic) topic.status = '✅ Posted';
  // Also save draft if there's content
  saveTopicDraft(topicId);
  topicBankState.draftTopicId = null;
  filterTopics();
}

function cycleTopicStatus(id) {
  const topic = MOCK_TOPICS.find(t => t.id === id);
  if (!topic) return;
  const idx = TOPIC_STATUSES.indexOf(topic.status);
  topic.status = TOPIC_STATUSES[(idx + 1) % TOPIC_STATUSES.length];
  filterTopics();
}

function setTopicStatus(id, status) {
  const topic = MOCK_TOPICS.find(t => t.id === id);
  if (topic) topic.status = status;
  filterTopics();
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
        <h3>📤 Buffer Integration</h3>
        <div class="setting-row">
          <div class="setting-label">Buffer API Key<div class="desc">Access token for Buffer publishing API</div></div>
          <input class="setting-input" type="password" id="buffer-api-key" placeholder="Enter Buffer API key..." value="${APP.settings.bufferApiKey || ''}" onchange="APP.settings.bufferApiKey=this.value">
        </div>
        <div class="setting-row">
          <div class="setting-label">Test Connection<div class="desc">Verify your Buffer API key and see connected profiles</div></div>
          <button class="btn btn-secondary btn-sm" onclick="testBufferConnection()">🔌 Test Connection</button>
        </div>
        <div id="buffer-profiles" style="margin-top:12px;"></div>
        <div id="buffer-queue" style="margin-top:12px;"></div>
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
  navigateTo(APP.currentPage);
}

// ===== BUFFER INTEGRATION =====
const BUFFER_API_BASE = 'https://api.bufferapp.com/1/';

function getBufferKey() {
  return APP.settings.bufferApiKey || '3tvNQCHMNmsTTm4i1gFBJMtpS-MvTHB6ythigBiYqpa';
}

async function testBufferConnection() {
  const key = getBufferKey();
  if (!key) { alert('Enter a Buffer API key first'); return; }
  const el = document.getElementById('buffer-profiles');
  el.innerHTML = '<div style="color:var(--text-muted);font-size:12px;">Testing connection...</div>';
  try {
    const r = await fetch(`${BUFFER_API_BASE}profiles.json?access_token=${key}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const profiles = await r.json();
    APP.bufferProfiles = profiles;
    el.innerHTML = `<div class="card" style="margin-top:8px;">
      <div style="font-size:12px;color:var(--green);margin-bottom:8px;">✅ Connected! ${profiles.length} profile(s) found:</div>
      ${profiles.map(p => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
        ${p.avatar_https ? `<img src="${p.avatar_https}" style="width:28px;height:28px;border-radius:50%;">` : ''}
        <div>
          <div style="font-size:12px;font-weight:600;">${p.formatted_username || p.service_username}</div>
          <div style="font-size:11px;color:var(--text-muted);">${p.service} · ${p.counts?.pending || 0} in queue</div>
        </div>
      </div>`).join('')}
    </div>`;
    // Also load queue
    loadBufferQueue();
  } catch (e) {
    el.innerHTML = `<div style="color:var(--red);font-size:12px;">❌ Connection failed: ${e.message}</div>`;
  }
}

async function loadBufferQueue() {
  const key = getBufferKey();
  if (!APP.bufferProfiles?.length) return;
  const queueEl = document.getElementById('buffer-queue');
  if (!queueEl) return;
  
  try {
    const profile = APP.bufferProfiles[0];
    const r = await fetch(`${BUFFER_API_BASE}profiles/${profile.id}/updates/pending.json?access_token=${key}`);
    if (!r.ok) return;
    const data = await r.json();
    const updates = data.updates || [];
    if (updates.length === 0) {
      queueEl.innerHTML = '<div style="font-size:12px;color:var(--text-muted);">📭 Queue is empty</div>';
      return;
    }
    queueEl.innerHTML = `<div class="card">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;">📅 Upcoming Scheduled Posts (${updates.length})</div>
      ${updates.slice(0, 5).map(u => `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">
        <div style="color:var(--text-primary);margin-bottom:2px;">${(u.text || '').substring(0, 100)}${u.text?.length > 100 ? '...' : ''}</div>
        <div style="color:var(--text-muted);font-size:10px;">${u.due_at ? new Date(u.due_at * 1000).toLocaleString() : 'Queued'}</div>
      </div>`).join('')}
    </div>`;
  } catch (e) {
    console.log('Buffer queue load error:', e);
  }
}

async function scheduleViaBuffer(text, profileIdx) {
  const key = getBufferKey();
  if (!key) { alert('Configure Buffer API key in Settings'); return; }
  
  // Get profiles if not cached
  if (!APP.bufferProfiles) {
    try {
      const r = await fetch(`${BUFFER_API_BASE}profiles.json?access_token=${key}`);
      APP.bufferProfiles = await r.json();
    } catch (e) { alert('Failed to connect to Buffer: ' + e.message); return; }
  }
  
  if (!APP.bufferProfiles?.length) { alert('No Buffer profiles found'); return; }
  
  const profile = APP.bufferProfiles[profileIdx || 0];
  
  try {
    const body = new URLSearchParams();
    body.append('access_token', key);
    body.append('text', text);
    body.append('profile_ids[]', profile.id);
    body.append('now', 'false');
    
    const r = await fetch(`${BUFFER_API_BASE}updates/create.json`, {
      method: 'POST',
      body: body,
    });
    
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const result = await r.json();
    if (result.success) {
      alert('✅ Added to Buffer queue!');
    } else {
      alert('Buffer error: ' + (result.message || JSON.stringify(result)));
    }
  } catch (e) {
    alert('Failed to schedule: ' + e.message);
  }
}

function showBufferModal(text) {
  const profiles = APP.bufferProfiles || [];
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.id = 'buffer-modal';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `<div class="modal">
    <h3>📤 Schedule via Buffer</h3>
    <div class="modal-field"><label>Post Text</label>
      <textarea class="draft-textarea" id="buffer-text" style="min-height:100px;">${escapeHtml(text)}</textarea>
    </div>
    <div class="modal-field"><label>Profile</label>
      <select id="buffer-profile-select" class="setting-input" style="width:100%;appearance:auto;">
        ${profiles.length ? profiles.map((p, i) => `<option value="${i}">${p.formatted_username || p.service_username} (${p.service})</option>`).join('') : '<option>Loading profiles...</option>'}
      </select>
    </div>
    <div class="modal-field" style="display:flex;gap:8px;">
      <label style="display:flex;align-items:center;gap:4px;"><input type="radio" name="buffer-timing" value="queue" checked> Add to Queue</label>
      <label style="display:flex;align-items:center;gap:4px;"><input type="radio" name="buffer-timing" value="now"> Post Now</label>
      <label style="display:flex;align-items:center;gap:4px;"><input type="radio" name="buffer-timing" value="schedule"> Schedule</label>
    </div>
    <div id="buffer-schedule-time" style="display:none;margin-bottom:12px;">
      <input type="datetime-local" id="buffer-datetime" class="setting-input" style="width:100%;">
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('buffer-modal').remove()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="submitBufferPost()">📤 Schedule</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  
  // Toggle schedule time
  modal.querySelectorAll('input[name="buffer-timing"]').forEach(r => {
    r.onchange = () => {
      document.getElementById('buffer-schedule-time').style.display = r.value === 'schedule' ? 'block' : 'none';
    };
  });
  
  // Load profiles if needed
  if (!profiles.length) {
    (async () => {
      try {
        const r = await fetch(`${BUFFER_API_BASE}profiles.json?access_token=${getBufferKey()}`);
        APP.bufferProfiles = await r.json();
        const sel = document.getElementById('buffer-profile-select');
        sel.innerHTML = APP.bufferProfiles.map((p, i) => `<option value="${i}">${p.formatted_username || p.service_username} (${p.service})</option>`).join('');
      } catch (e) { console.error('Buffer profiles:', e); }
    })();
  }
}

async function submitBufferPost() {
  const text = document.getElementById('buffer-text')?.value;
  if (!text?.trim()) return;
  const profileIdx = parseInt(document.getElementById('buffer-profile-select')?.value || '0');
  const timing = document.querySelector('input[name="buffer-timing"]:checked')?.value || 'queue';
  
  const key = getBufferKey();
  const profile = APP.bufferProfiles?.[profileIdx];
  if (!profile) { alert('Select a profile'); return; }
  
  const body = new URLSearchParams();
  body.append('access_token', key);
  body.append('text', text);
  body.append('profile_ids[]', profile.id);
  
  if (timing === 'now') {
    body.append('now', 'true');
  } else if (timing === 'schedule') {
    const dt = document.getElementById('buffer-datetime')?.value;
    if (dt) body.append('scheduled_at', new Date(dt).toISOString());
  }
  
  try {
    const r = await fetch(`${BUFFER_API_BASE}updates/create.json`, { method: 'POST', body });
    const result = await r.json();
    if (result.success !== false) {
      alert('✅ ' + (timing === 'now' ? 'Posted!' : 'Added to Buffer queue!'));
      document.getElementById('buffer-modal')?.remove();
    } else {
      alert('Buffer error: ' + (result.message || 'Unknown error'));
    }
  } catch (e) {
    alert('Failed: ' + e.message);
  }
}
