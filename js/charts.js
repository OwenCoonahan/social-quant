// Social Quant — Chart.js Visualizations

const CHART_COLORS = {
  green: '#22c55e',
  greenLight: '#4ade80',
  greenDark: '#16a34a',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  red: '#ef4444',
  yellow: '#eab308',
  cyan: '#06b6d4',
  pink: '#ec4899',
  gray: '#6b7280',
  gridLine: 'rgba(255,255,255,0.06)',
  gridLineDark: 'rgba(255,255,255,0.06)',
  text: '#a1a1aa',
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: CHART_COLORS.text, font: { family: "'Geist', sans-serif", size: 11 } } },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#fafafa',
      bodyColor: '#a1a1aa',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleFont: { family: "'Geist', sans-serif" },
      bodyFont: { family: "'Geist', sans-serif" },
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    x: { ticks: { color: CHART_COLORS.text, font: { family: "'Geist', sans-serif", size: 10 } }, grid: { color: CHART_COLORS.gridLine } },
    y: { ticks: { color: CHART_COLORS.text, font: { family: "'Geist', sans-serif", size: 10 } }, grid: { color: CHART_COLORS.gridLine } },
  },
};

let chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function renderContentTypeChart(canvasId) {
  destroyChart(canvasId);
  const types = ['text', 'image', 'thread', 'video', 'carousel'];
  const avgEngagement = types.map(t => {
    const posts = MOCK_POSTS.filter(p => p.type === t);
    if (!posts.length) return 0;
    return posts.reduce((sum, p) => sum + p.engagementRate, 0) / posts.length;
  });
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: types.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
      datasets: [{
        label: 'Avg Engagement Rate %',
        data: avgEngagement,
        backgroundColor: [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.orange, CHART_COLORS.cyan],
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } }, scales: { ...CHART_DEFAULTS.scales, x: { ...CHART_DEFAULTS.scales.x, grid: { display: false } } } },
  });
}

function renderEngagementOverTimeChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  // Group posts by day for last 14 days
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  // Twitter avg engagement per day
  const twitterData = days.map((_, i) => {
    const dayOffset = 13 - i;
    const posts = MOCK_POSTS.filter(p => {
      const pd = Math.floor((new Date() - new Date(p.timestamp)) / 86400000);
      return pd === dayOffset && p.platform === 'twitter';
    });
    if (!posts.length) return null;
    return posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length;
  });
  const linkedinData = days.map((_, i) => {
    const dayOffset = 13 - i;
    const posts = MOCK_POSTS.filter(p => {
      const pd = Math.floor((new Date() - new Date(p.timestamp)) / 86400000);
      return pd === dayOffset && p.platform === 'linkedin';
    });
    if (!posts.length) return null;
    return posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length;
  });
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        { label: 'Twitter', data: twitterData, borderColor: CHART_COLORS.blue, backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, spanGaps: true, pointRadius: 3, pointBackgroundColor: CHART_COLORS.blue },
        { label: 'LinkedIn', data: linkedinData, borderColor: CHART_COLORS.green, backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4, spanGaps: true, pointRadius: 3, pointBackgroundColor: CHART_COLORS.green },
      ],
    },
    options: CHART_DEFAULTS,
  });
}

function renderPlatformComparisonChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const twitterPosts = MOCK_POSTS.filter(p => p.platform === 'twitter');
  const linkedinPosts = MOCK_POSTS.filter(p => p.platform === 'linkedin');
  const tAvg = (arr, fn) => arr.length ? arr.reduce((s, p) => s + fn(p), 0) / arr.length : 0;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Avg Engagement %', 'Avg Likes', 'Avg Reposts', 'Avg Comments'],
      datasets: [
        { label: 'Twitter', data: [tAvg(twitterPosts, p => p.engagementRate), tAvg(twitterPosts, p => p.likes), tAvg(twitterPosts, p => p.retweets), tAvg(twitterPosts, p => p.replies)], backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
        { label: 'LinkedIn', data: [tAvg(linkedinPosts, p => p.engagementRate), tAvg(linkedinPosts, p => p.likes), tAvg(linkedinPosts, p => p.retweets), tAvg(linkedinPosts, p => p.replies)], backgroundColor: CHART_COLORS.green, borderRadius: 4 },
      ],
    },
    options: { ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, x: { ...CHART_DEFAULTS.scales.x, grid: { display: false } } } },
  });
}

function renderPostingTimesHeatmap(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  // Simple bar chart of posts by hour
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const countByHour = hours.map(h => {
    return MOCK_POSTS.filter(p => new Date(p.timestamp).getHours() === h).length;
  });
  const engByHour = hours.map(h => {
    const posts = MOCK_POSTS.filter(p => new Date(p.timestamp).getHours() === h);
    if (!posts.length) return 0;
    return posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length;
  });
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hours.map(h => `${h}:00`),
      datasets: [{
        label: 'Avg Engagement %',
        data: engByHour,
        backgroundColor: engByHour.map(v => v > 5 ? CHART_COLORS.green : v > 3 ? CHART_COLORS.greenLight : 'rgba(34,197,94,0.3)'),
        borderRadius: 3,
      }],
    },
    options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } }, scales: { ...CHART_DEFAULTS.scales, x: { ...CHART_DEFAULTS.scales.x, grid: { display: false }, ticks: { ...CHART_DEFAULTS.scales.x.ticks, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } } } },
  });
}

function renderFollowerGrowthChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const labels = ['4w ago', '3w ago', '2w ago', '1w ago', 'Now'];
  const topAccounts = ALL_ACCOUNTS.filter(a => a.followersHistory).sort((a, b) => b.avgEngagement - a.avgEngagement).slice(0, 5);
  const colors = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.orange, CHART_COLORS.cyan];
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: topAccounts.map((a, i) => ({
        label: a.name,
        data: a.followersHistory,
        borderColor: colors[i],
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: colors[i],
        fill: false,
      })),
    },
    options: { ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: v => formatNumber(v) } } } },
  });
}

function renderMyPostsChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const sorted = [...MOCK_MY_POSTS].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sorted.map(p => formatDate(p.timestamp)),
      datasets: [
        { label: 'Engagement Rate %', data: sorted.map(p => p.engagementRate), borderColor: CHART_COLORS.green, tension: 0.3, pointRadius: 5, pointBackgroundColor: CHART_COLORS.green, fill: false },
      ],
    },
    options: CHART_DEFAULTS,
  });
}
