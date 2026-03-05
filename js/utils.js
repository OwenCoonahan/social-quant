// Social Quant — Utility Functions

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function calcEngagementRate(post) {
  const account = ALL_ACCOUNTS.find(a => a.id === post.accountId);
  if (!account || !account.followers) return 0;
  const total = (post.likes || 0) + (post.retweets || 0) + (post.replies || 0) + (post.bookmarks || 0);
  return ((total / account.followers) * 100).toFixed(2);
}

function calcWeightedEngagement(post) {
  // Twitter algorithm weights: RT=20x, Reply=13.5x, Bookmark=10x, Like=1x
  return (post.likes || 0) * 1 + (post.retweets || 0) * 20 + (post.replies || 0) * 13.5 + (post.bookmarks || 0) * 10;
}

function calcTotalEngagement(post) {
  return (post.likes || 0) + (post.retweets || 0) + (post.replies || 0) + (post.bookmarks || 0);
}

function getPostTypeIcon(type) {
  const icons = { text: '📝', image: '🖼️', video: '🎬', thread: '🧵', carousel: '📑', poll: '📊' };
  return icons[type] || '📝';
}

function getPlatformIcon(platform) {
  return platform === 'twitter' ? '𝕏' : 'in';
}

function getGrowthRate(history) {
  if (!history || history.length < 2) return 0;
  const first = history[0];
  const last = history[history.length - 1];
  return (((last - first) / first) * 100).toFixed(1);
}

function getHourFromISO(iso) {
  return new Date(iso).getHours();
}

function getDayFromISO(iso) {
  return new Date(iso).getDay(); // 0=Sun
}

function truncate(str, len = 280) {
  if (str.length <= len) return str;
  return str.substring(0, len) + '…';
}

function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Simple search across posts and accounts
function searchAll(query) {
  const q = query.toLowerCase();
  const accounts = ALL_ACCOUNTS.filter(a =>
    a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || (a.bio && a.bio.toLowerCase().includes(q))
  );
  const posts = MOCK_POSTS.filter(p => p.content.toLowerCase().includes(q));
  return { accounts, posts };
}
