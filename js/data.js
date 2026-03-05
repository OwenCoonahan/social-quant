// Social Quant — Data Layer
// Loads real data from data/real-data.json if available, falls back to mock data

let REAL_DATA_LOADED = false;
let REAL_POSTS = [];
let REAL_ACCOUNTS_DATA = [];

// Load real data async
(function loadRealData() {
  fetch('data/real-data.json')
    .then(r => { if (!r.ok) throw new Error('No real data'); return r.json(); })
    .then(data => {
      REAL_DATA_LOADED = true;
      REAL_POSTS = data.posts || [];
      REAL_ACCOUNTS_DATA = data.accounts || [];
      console.log(`✅ Loaded ${REAL_POSTS.length} real posts from ${REAL_ACCOUNTS_DATA.length} accounts (fetched ${data.fetchedAt})`);
      // Merge real account data into TWITTER_ACCOUNTS
      for (const ra of REAL_ACCOUNTS_DATA) {
        const acct = TWITTER_ACCOUNTS.find(a => a.id === ra.id);
        if (acct) {
          if (ra.followers) acct.followers = ra.followers;
          if (ra.bio) acct.bio = ra.bio;
          if (ra.avatarUrl) acct.avatarUrl = ra.avatarUrl;
          if (ra.name) acct.name = ra.name;
          acct.verified = ra.verified;
        }
      }
      // Merge real posts into MOCK_POSTS (prepend, deduplicate by accountId)
      const realAccountIds = new Set(REAL_POSTS.map(p => p.accountId));
      // Remove mock posts for accounts we have real data for
      const filteredMock = MOCK_POSTS.filter(p => !realAccountIds.has(p.accountId));
      MOCK_POSTS.length = 0;
      MOCK_POSTS.push(...REAL_POSTS, ...filteredMock);
      // Re-render if app is loaded
      if (typeof navigateTo === 'function' && typeof APP !== 'undefined') {
        navigateTo(APP.currentPage);
      }
    })
    .catch(() => console.log('ℹ️ No real data file found, using mock data'));
})();

// All data is realistic but synthetic for demo purposes

const CATEGORIES = ['energy', 'grid', 'policy', 'data/builder', 'PE/VC', 'minerals', 'solar', 'AI+energy', 'markets'];

const TWITTER_ACCOUNTS = [
  { id: 't1', platform: 'twitter', handle: '@GridStatusLive', name: 'Grid Status', avatar: '⚡', followers: 89200, followersHistory: [85100, 86000, 87200, 88100, 89200], avgEngagement: 3.2, postFrequency: 4.1, category: 'grid', bio: 'Real-time grid data and analysis for the US power system', verified: true },
  { id: 't2', platform: 'twitter', handle: '@EIAgov', name: 'U.S. EIA', avatar: '🏛️', followers: 142000, followersHistory: [139000, 140200, 140800, 141500, 142000], avgEngagement: 1.8, postFrequency: 3.2, category: 'energy', bio: 'Official account of the U.S. Energy Information Administration', verified: true },
  { id: 't3', platform: 'twitter', handle: '@SPGlobalPlatts', name: 'S&P Global Commodity Insights', avatar: '📊', followers: 215000, followersHistory: [210000, 211500, 213000, 214200, 215000], avgEngagement: 1.4, postFrequency: 5.8, category: 'markets', bio: 'Essential intelligence on energy, petrochemicals, metals, agriculture', verified: true },
  { id: 't4', platform: 'twitter', handle: '@JesseJenkins', name: 'Jesse Jenkins', avatar: '🔬', followers: 67800, followersHistory: [61200, 63100, 64800, 66500, 67800], avgEngagement: 4.7, postFrequency: 2.3, category: 'energy', bio: 'Princeton professor. Energy systems engineer. Host of @ThePowerSector podcast.', verified: true },
  { id: 't5', platform: 'twitter', handle: '@canaborern', name: 'Cana Boren', avatar: '🌱', followers: 28400, followersHistory: [24100, 25300, 26500, 27600, 28400], avgEngagement: 5.1, postFrequency: 1.8, category: 'energy', bio: 'Clean energy analysis. Data-driven takes on the energy transition.', verified: false },
  { id: 't6', platform: 'twitter', handle: '@levelsio', name: 'Pieter Levels', avatar: '🚀', followers: 524000, followersHistory: [490000, 502000, 510000, 518000, 524000], avgEngagement: 6.8, postFrequency: 3.5, category: 'data/builder', bio: 'Building startups in public. #1 on ProductHunt x12. nomadlist.com, remoteok.com, photoai.com', verified: true },
  { id: 't7', platform: 'twitter', handle: '@EnergyAtRisky', name: 'Energy at Risk', avatar: '💰', followers: 15600, followersHistory: [13200, 14000, 14600, 15100, 15600], avgEngagement: 3.9, postFrequency: 1.5, category: 'PE/VC', bio: 'Energy finance, risk analysis, and market commentary', verified: false },
  { id: 't8', platform: 'twitter', handle: '@Solar_Rebecca', name: 'Rebecca Kujawa', avatar: '☀️', followers: 31200, followersHistory: [28400, 29200, 30000, 30700, 31200], avgEngagement: 3.4, postFrequency: 2.1, category: 'solar', bio: 'Solar industry analysis. CEO of NextEra Energy Resources.', verified: true },
  { id: 't9', platform: 'twitter', handle: '@GridBrief', name: 'Grid Brief', avatar: '📰', followers: 22800, followersHistory: [19500, 20400, 21200, 22000, 22800], avgEngagement: 4.2, postFrequency: 2.8, category: 'grid', bio: 'Daily newsletter on the US power grid. Data, analysis, signal.', verified: false },
  { id: 't10', platform: 'twitter', handle: '@CleanAirTaskFrc', name: 'Clean Air Task Force', avatar: '🌍', followers: 45600, followersHistory: [42300, 43200, 44100, 44900, 45600], avgEngagement: 2.6, postFrequency: 3.1, category: 'policy', bio: 'Pushing the envelope on technologies and policies for a zero-emissions, high-energy planet.', verified: true },
];

const LINKEDIN_ACCOUNTS = [
  { id: 'l1', platform: 'linkedin', handle: 'jason-burwen', name: 'Jason Burwen', avatar: '🔋', followers: 18500, followersHistory: [16200, 16900, 17400, 18000, 18500], avgEngagement: 4.8, postFrequency: 2.2, category: 'energy', bio: 'VP, Energy Storage Association. Building the storage industry.', verified: false },
  { id: 'l2', platform: 'linkedin', handle: 'jigar-shah', name: 'Jigar Shah', avatar: '🏦', followers: 95200, followersHistory: [88000, 90100, 91800, 93600, 95200], avgEngagement: 5.6, postFrequency: 1.8, category: 'policy', bio: 'Director, DOE Loan Programs Office. $400B+ to deploy.', verified: true },
  { id: 'l3', platform: 'linkedin', handle: 'lesley-slaton-brown', name: 'Lesley Slaton Brown', avatar: '⚡', followers: 12300, followersHistory: [10800, 11200, 11600, 12000, 12300], avgEngagement: 3.9, postFrequency: 1.5, category: 'energy', bio: 'Chief Diversity Officer, HP Inc. Clean energy advocate.', verified: false },
  { id: 'l4', platform: 'linkedin', handle: 'michael-rothman', name: 'Michael Rothman', avatar: '📈', followers: 8400, followersHistory: [7200, 7500, 7800, 8100, 8400], avgEngagement: 3.2, postFrequency: 1.2, category: 'PE/VC', bio: 'Partner, Energy Capital Partners. PE in power & infrastructure.', verified: false },
];

const ALL_ACCOUNTS = [...TWITTER_ACCOUNTS, ...LINKEDIN_ACCOUNTS];

// Helper to generate dates in recent weeks
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 14) + 7, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

const MOCK_POSTS = [
  // GridStatusLive
  { id: 'p1', accountId: 't1', platform: 'twitter', content: 'ERCOT just hit a new winter peak demand record: 78.2 GW\n\nThat\'s 4.3 GW above the previous record set in 2021.\n\nKey difference: This time, 12 GW of battery storage is online.\n\nThe grid held. Here\'s the real-time data 👇', type: 'image', likes: 2840, retweets: 891, replies: 234, bookmarks: 567, timestamp: daysAgo(1), engagementRate: 5.8 },
  { id: 'p2', accountId: 't1', platform: 'twitter', content: 'Real-time grid frequency across all US interconnections right now:\n\nEastern: 59.98 Hz\nWestern: 60.01 Hz\nERCOT: 59.97 Hz\n\nERCOT running tight as temperatures drop below forecast.', type: 'text', likes: 1200, retweets: 342, replies: 89, bookmarks: 234, timestamp: daysAgo(2), engagementRate: 3.1 },
  { id: 'p3', accountId: 't1', platform: 'twitter', content: 'Interconnection queue update — February 2026:\n\n• 12,400 active projects\n• $2.8T in proposed capacity\n• Average wait: 4.9 years (up from 4.7 in Jan)\n• Solar+storage: 67% of all requests\n• Completion rate: 21%\n\nThe queue is growing faster than projects exit it.', type: 'image', likes: 3200, retweets: 1100, replies: 312, bookmarks: 890, timestamp: daysAgo(3), engagementRate: 7.2 },
  
  // EIAgov
  { id: 'p4', accountId: 't2', platform: 'twitter', content: 'NEW: U.S. electricity generation from solar exceeded coal for the first time in February 2026.\n\nSolar: 14.2% of total generation\nCoal: 13.8%\n\nFull data in our Monthly Energy Review, out today.', type: 'image', likes: 8900, retweets: 4200, replies: 890, bookmarks: 2100, timestamp: daysAgo(1), engagementRate: 4.2 },
  { id: 'p5', accountId: 't2', platform: 'twitter', content: 'U.S. natural gas storage is 8% below the 5-year average heading into March.\n\nData center demand continues to tighten the market.\n\nOur latest Short-Term Energy Outlook projects prices at $3.80/MMBtu through summer.', type: 'text', likes: 2100, retweets: 780, replies: 156, bookmarks: 445, timestamp: daysAgo(4), engagementRate: 2.1 },
  
  // SPGlobalPlatts
  { id: 'p6', accountId: 't3', platform: 'twitter', content: 'BREAKING: European carbon prices hit €95/tonne — highest since August 2023.\n\nDriving factors:\n→ Colder-than-expected winter\n→ Natural gas price rally\n→ EU ETS market stability reserve tightening\n\nFull analysis from our team.', type: 'text', likes: 1800, retweets: 650, replies: 123, bookmarks: 312, timestamp: daysAgo(2), engagementRate: 1.6 },
  
  // JesseJenkins
  { id: 'p7', accountId: 't4', platform: 'twitter', content: 'I spent 200 hours analyzing the IRA\'s impact on clean energy deployment.\n\nThe results surprised me.\n\nHere\'s what the data actually shows — not what either side wants you to believe: 🧵\n\n1/ The IRA has driven $340B in announced clean energy investments since passage.\n\nBut announced ≠ built.\n\nOnly 38% of announced projects have broken ground.\nOnly 12% are operational.\n\nThe gap between announcements and reality is enormous.', type: 'thread', likes: 12400, retweets: 4800, replies: 1890, bookmarks: 3200, timestamp: daysAgo(1), engagementRate: 8.9 },
  { id: 'p8', accountId: 't4', platform: 'twitter', content: 'Hot take: The "nuclear renaissance" narrative is 90% hype, 10% reality.\n\nSMRs are still 5+ years from commercial operation.\nNew large nuclear is $15B+ per plant.\n\nWhat IS real: life extensions of existing fleet + uprates.\n\nThe grid needs existing nuclear. New nuclear is a 2035+ story.', type: 'text', likes: 5600, retweets: 1800, replies: 890, bookmarks: 1200, timestamp: daysAgo(5), engagementRate: 6.2 },
  
  // canaborern
  { id: 'p9', accountId: 't5', platform: 'twitter', content: 'Everyone talks about solar costs falling.\n\nNobody talks about interconnection costs rising.\n\nAverage network upgrade cost per MW in PJM:\n2020: $48,000\n2023: $127,000\n2025: $215,000\n\nThe cost of CONNECTING clean energy is rising faster than the cost of BUILDING it is falling.', type: 'image', likes: 4200, retweets: 1600, replies: 456, bookmarks: 1100, timestamp: daysAgo(2), engagementRate: 7.8 },
  { id: 'p10', accountId: 't5', platform: 'twitter', content: 'Transformer lead times, updated for Q1 2026:\n\n• Large power transformers: 3-4 years (!!)\n• Distribution transformers: 18-24 months\n• Pad-mount: 12-16 months\n\nYou literally cannot build grid infrastructure fast enough because we can\'t make transformers.\n\nThis is the real bottleneck nobody talks about.', type: 'text', likes: 6800, retweets: 2400, replies: 678, bookmarks: 1800, timestamp: daysAgo(3), engagementRate: 9.1 },
  
  // levelsio
  { id: 'p11', accountId: 't6', platform: 'twitter', content: 'My AI photo app just crossed $2M/month in revenue.\n\nStack:\n• 2 servers ($400/mo)\n• No employees\n• No VC money\n• Built in 3 months\n\nThe internet is insane right now.\n\nHere\'s everything I learned scaling to $24M ARR solo 🧵', type: 'thread', likes: 34000, retweets: 8900, replies: 3400, bookmarks: 12000, timestamp: daysAgo(1), engagementRate: 12.4 },
  { id: 'p12', accountId: 't6', platform: 'twitter', content: 'Stop building features.\n\nStart building distribution.\n\n95% of failed startups had a product problem.\n0% had a product problem — they had a distribution problem.\n\nThe product IS the marketing now.', type: 'text', likes: 18000, retweets: 5200, replies: 1200, bookmarks: 4500, timestamp: daysAgo(3), engagementRate: 8.7 },
  
  // EnergyAtRisky
  { id: 'p13', accountId: 't7', platform: 'twitter', content: 'Data center power demand projections keep getting revised UP.\n\n2024 forecast: 35 GW by 2030\n2025 forecast: 52 GW by 2030\n2026 forecast: 74 GW by 2030\n\nThat\'s the equivalent of adding the entire ERCOT grid just for data centers.\n\nWhere does the power come from?', type: 'image', likes: 2800, retweets: 980, replies: 345, bookmarks: 780, timestamp: daysAgo(2), engagementRate: 5.4 },
  
  // Solar_Rebecca
  { id: 'p14', accountId: 't8', platform: 'twitter', content: 'US solar installations in 2025: 42 GW\n\nThat\'s up 28% YoY despite:\n→ Module tariff uncertainty\n→ Interconnection delays\n→ Higher interest rates\n\nThe solar industry just keeps executing. The economics are too good to stop.', type: 'image', likes: 3100, retweets: 890, replies: 234, bookmarks: 567, timestamp: daysAgo(1), engagementRate: 4.1 },
  
  // GridBrief
  { id: 'p15', accountId: 't9', platform: 'twitter', content: 'FERC just approved a landmark transmission planning rule.\n\nKey changes:\n1. 20-year planning horizon (up from 10)\n2. States must share costs for multi-state lines\n3. Grid-enhancing technologies get priority\n\nThis could unlock $100B+ in new transmission.\n\nBut implementation will take years. Here\'s why 👇', type: 'thread', likes: 3800, retweets: 1400, replies: 456, bookmarks: 890, timestamp: daysAgo(4), engagementRate: 6.8 },
  { id: 'p16', accountId: 't9', platform: 'twitter', content: 'The US added more battery storage in Q4 2025 than in all of 2022 combined.\n\n4.2 GW in a single quarter.\n\nTexas: 38% of installations\nCalifornia: 29%\nArizona: 11%\n\nStorage is no longer "emerging" — it\'s a mature, scaling industry.', type: 'image', likes: 2400, retweets: 780, replies: 198, bookmarks: 445, timestamp: daysAgo(6), engagementRate: 5.1 },
  
  // CleanAirTaskFrc
  { id: 'p17', accountId: 't10', platform: 'twitter', content: 'NEW REPORT: The Carbon Capture Landscape 2026\n\n→ 41 projects in development globally\n→ Total capture capacity: 180 Mtpa (if all built)\n→ Only 8 projects have reached FID\n→ Average cost: $80-120/tonne\n\nThe gap between ambition and execution remains wide.\n\nFull report 👇', type: 'image', likes: 1900, retweets: 670, replies: 189, bookmarks: 445, timestamp: daysAgo(3), engagementRate: 3.2 },
  
  // LinkedIn posts (with placeholder media/link fields)
  { id: 'p18', accountId: 'l1', platform: 'linkedin', linkUrl: 'https://linkedin.com/in/jason-burwen', media: [], content: 'Energy storage is having its "solar 2015" moment.\n\nCosts have fallen 40% in 2 years. Deployment is up 200% YoY. And utilities are finally signing 10-year contracts.\n\nBut here\'s what most people miss about the storage market:\n\nThe value stack is shifting.\n\nTwo years ago, arbitrage was the primary revenue stream. Today, capacity payments and ancillary services make up 60% of storage revenue.\n\nThis changes everything about project economics.\n\n3 things I\'m watching:\n\n1. Duration is getting longer — 4-hour batteries are the new standard, 8-hour is coming fast\n2. Co-location with solar is becoming the default, not the exception\n3. The merchant risk appetite is growing as developers get more sophisticated\n\nThe companies that figure out the software stack for storage optimization will capture most of the value.\n\nWhat trends are you seeing in storage? 👇', type: 'text', likes: 890, retweets: 156, replies: 234, bookmarks: 120, timestamp: daysAgo(1), engagementRate: 5.2 },
  
  { id: 'p19', accountId: 'l2', platform: 'linkedin', linkUrl: 'https://linkedin.com/in/jigar-shah', media: [], content: 'The DOE Loan Programs Office has now committed over $45 billion since 2021.\n\nHere\'s what we\'re seeing in applications right now:\n\n→ Nuclear: Applications up 300% since 2024\n→ Critical minerals processing: Fastest growing category\n→ Grid infrastructure: Transformer manufacturing is the new hot sector\n→ Geothermal: Next-gen projects are finally bankable\n\nThe common thread? These are all technologies that private capital alone won\'t fund at the speed we need.\n\nThat\'s exactly what LPO was built for.\n\nThe energy transition isn\'t just about solar and wind anymore. It\'s about the entire supply chain — from mining to manufacturing to the grid that connects it all.\n\nWe\'re open for business. If you\'re building critical infrastructure, talk to us.\n\n#CleanEnergy #Infrastructure #DOE', type: 'text', likes: 2400, retweets: 445, replies: 567, bookmarks: 312, timestamp: daysAgo(2), engagementRate: 6.8 },
  
  { id: 'p20', accountId: 'l3', platform: 'linkedin', linkUrl: 'https://linkedin.com/in/lesley-slaton-brown', media: [], content: 'I\'ve spent 20 years in the energy industry.\n\nThe last 3 years have seen more change than the previous 17 combined.\n\nHere are 5 shifts that fundamentally changed the clean energy landscape:\n\n1. The IRA made the US the most attractive clean energy market globally\n2. Supply chain reshoring went from "nice to have" to "national security"\n3. AI power demand turned data centers into the largest new electricity consumers\n4. Battery storage went from niche to necessity\n5. The workforce gap became the #1 bottleneck\n\nThe technology works. The economics work. The policy works.\n\nThe constraint now is people. We need 500,000+ workers in clean energy by 2030.\n\nHow are you thinking about talent in this space?', type: 'text', likes: 670, retweets: 89, replies: 156, bookmarks: 78, timestamp: daysAgo(3), engagementRate: 4.1 },
  
  { id: 'p21', accountId: 'l4', platform: 'linkedin', linkUrl: 'https://linkedin.com/in/michael-rothman', media: [], content: 'PE in power infrastructure is having a moment.\n\nOur latest analysis of deal flow:\n\n→ Transaction volume up 45% YoY\n→ Average deal size: $380M (up from $240M in 2023)\n→ Hottest sectors: Battery storage, grid services, data center power\n→ Multiple compression in renewables but expansion in "grid edge"\n\nThe thesis has shifted from "build renewables" to "fix the grid."\n\nDevelopers with interconnection expertise and utility relationships are commanding premium valuations.\n\nThe question for 2026: Does the compressed timeline for data center power demand create opportunity or risk?\n\nBoth. And it depends entirely on your grid position.', type: 'text', likes: 445, retweets: 67, replies: 98, bookmarks: 89, timestamp: daysAgo(4), engagementRate: 3.5 },
  
  // More Twitter posts for richer feed
  { id: 'p22', accountId: 't4', platform: 'twitter', content: 'Thread: The real cost of electricity by source in 2026\n\nI updated our LCOE analysis with latest data.\n\nSpoiler: The ranking changed.\n\n1/ Solar + 4hr storage: $45/MWh (down 18% from 2024)\n2/ Onshore wind: $38/MWh\n3/ Natural gas CC: $62/MWh (up 15% — fuel costs)\n4/ Nuclear (existing): $33/MWh (cheapest! But no new builds at this cost)\n5/ Nuclear (new SMR): $89/MWh (still expensive)\n\nThe surprise? Gas is now MORE expensive than solar+storage in most markets.', type: 'thread', likes: 8900, retweets: 3200, replies: 1200, bookmarks: 2800, timestamp: daysAgo(6), engagementRate: 7.4 },
  
  { id: 'p23', accountId: 't6', platform: 'twitter', content: 'I built 14 products last year.\n\n3 make money.\n11 are dead.\n\nThat\'s a 21% success rate.\n\nBut those 3 products make $5M/month combined.\n\nThe lesson: Ship fast, kill fast, double down on winners.\n\nMost people spend 1 year building 1 thing that might not work.\n\nShip 14 things in that year instead.', type: 'text', likes: 24000, retweets: 6800, replies: 2100, bookmarks: 8500, timestamp: daysAgo(5), engagementRate: 10.2 },
  
  { id: 'p24', accountId: 't1', platform: 'twitter', content: 'California curtailed 4.1 TWh of solar in 2025.\n\nThat\'s enough electricity to power 380,000 homes for a year.\n\nJust... thrown away.\n\nBecause we can\'t move it to where it\'s needed fast enough.\n\nTransmission is the bottleneck. Storage is the band-aid. Both need to scale 5x.', type: 'image', likes: 4500, retweets: 1600, replies: 456, bookmarks: 980, timestamp: daysAgo(5), engagementRate: 6.1 },
  
  { id: 'p25', accountId: 't5', platform: 'twitter', content: 'New data from the battery supply chain:\n\nChina controls:\n→ 78% of cathode production\n→ 92% of anode production\n→ 85% of electrolyte production\n→ 70% of cell manufacturing\n\nThe IRA is trying to change this. But building a parallel supply chain takes a decade.\n\nWe\'re not even at year 4.', type: 'image', likes: 3800, retweets: 1400, replies: 345, bookmarks: 890, timestamp: daysAgo(7), engagementRate: 6.9 },
  
  { id: 'p26', accountId: 't9', platform: 'twitter', content: 'The most underappreciated chart in energy:\n\nUS electricity demand growth by driver (2024-2030, projected):\n\n→ Data centers: +74 GW\n→ EVs: +18 GW\n→ Heat pumps: +12 GW\n→ Industrial reshoring: +8 GW\n→ Efficiency gains: -15 GW\n\nNet new demand: ~97 GW\n\nWe haven\'t built 97 GW in a decade. We need to do it in 5 years.', type: 'image', likes: 5200, retweets: 1900, replies: 567, bookmarks: 1400, timestamp: daysAgo(8), engagementRate: 7.8 },
  
  { id: 'p27', accountId: 't7', platform: 'twitter', content: 'Copper is the new oil.\n\nPrice: $4.85/lb (near all-time highs)\nSupply deficit by 2027: 8 million tonnes\nNew mine development time: 15-20 years\n\nEvery EV, solar panel, wind turbine, data center, and grid upgrade needs copper.\n\nAnd we don\'t have enough.', type: 'text', likes: 2100, retweets: 780, replies: 234, bookmarks: 567, timestamp: daysAgo(9), engagementRate: 4.8 },
  
  { id: 'p28', accountId: 't8', platform: 'twitter', content: 'Rooftop solar economics in 2026:\n\n→ Average system cost: $2.50/W (down 12% YoY)\n→ Average payback period: 5.8 years\n→ States with best economics: TX, FL, CA, AZ, NV\n→ Net metering under attack in 12 states\n\nThe technology is cheaper than ever. The policy fight is where the action is.', type: 'image', likes: 2800, retweets: 890, replies: 278, bookmarks: 567, timestamp: daysAgo(10), engagementRate: 4.5 },
  
  { id: 'p29', accountId: 'l2', platform: 'linkedin', linkUrl: 'https://linkedin.com/in/jigar-shah', media: [], content: 'Big announcement: LPO just closed a $6.5 billion conditional commitment for the largest grid-scale battery manufacturing facility in North America.\n\n→ 50 GWh annual production capacity\n→ 3,200 permanent jobs\n→ Located in Georgia\n→ Operational by 2028\n\nThis is what industrial policy looks like in practice.\n\nThe US is building its own battery supply chain. It\'s happening. It\'s real. And it\'s accelerating.\n\nMore details in the press release (link in comments).', type: 'text', likes: 4500, retweets: 890, replies: 678, bookmarks: 445, timestamp: daysAgo(5), engagementRate: 7.2 },
  
  { id: 'p30', accountId: 't10', platform: 'twitter', content: 'The methane problem is bigger than most people realize.\n\nNew satellite data shows global methane emissions 70% higher than official inventories.\n\nThe worst offenders: oil & gas production in Permian Basin, Russia, Turkmenistan.\n\nBut here\'s the opportunity: cutting methane is the fastest way to slow warming. 80x more potent than CO2 over 20 years.\n\nOur new report maps every major methane source globally.', type: 'thread', likes: 2800, retweets: 1100, replies: 345, bookmarks: 670, timestamp: daysAgo(6), engagementRate: 3.8 },
];

// Swipe file entries (saved inspiration)
const MOCK_SWIPE_FILE = [
  { id: 's1', postId: 'p7', notes: 'Great thread structure — personal investment of time as hook, then surprising findings. Use this format for interconnection analysis.', tags: ['thread-structure', 'data-hook'], savedAt: daysAgo(1) },
  { id: 's2', postId: 'p11', notes: 'Build-in-public format. Show the stack, show the numbers, show the timeline. Applicable to tool launches.', tags: ['build-in-public', 'revenue'], savedAt: daysAgo(2) },
  { id: 's3', postId: 'p10', notes: 'Supply chain data + "nobody talks about this" framing. Very effective. Use for transformer/minerals content.', tags: ['supply-chain', 'contrarian'], savedAt: daysAgo(3) },
];

// Owen's posts tracker
const MOCK_MY_POSTS = [
  { id: 'm1', platform: 'twitter', content: 'I built a free tool that scores every solar developer in the US interconnection queue.\n\nIt checks: projects completed, average timeline, queue dropout rate, geographic spread.\n\nSome "developers" have a 0% completion rate across 50+ projects.\n\nPE firms: you\'re welcome.', type: 'image', likes: 890, retweets: 312, replies: 145, bookmarks: 445, timestamp: daysAgo(1), engagementRate: 4.2, pillar: 'build-in-public' },
  { id: 'm2', platform: 'twitter', content: 'The US imports 100% of its gallium from China.\n\nGallium is in every semiconductor, LED, and 5G chip.\n\nChina just restricted exports.\n\nWe built a tracker showing every critical mineral dependency.', type: 'image', likes: 2100, retweets: 780, replies: 234, bookmarks: 567, timestamp: daysAgo(3), engagementRate: 5.8, pillar: 'minerals' },
  { id: 'm3', platform: 'linkedin', content: 'The U.S. interconnection queue has $2.6 trillion in proposed projects.\n\n77% of them will never get built.\n\nI\'ve spent the last year building tools to analyze which projects are real — and which are vaporware.\n\nHere are 3 patterns that separate winners from the graveyard:\n\n1. Developer track record matters more than project size\n2. Queue position is meaningless without transmission capacity\n3. The ISOs with fastest processing have the lowest dropout rates', type: 'text', likes: 670, retweets: 89, replies: 156, bookmarks: 78, timestamp: daysAgo(5), engagementRate: 3.8, pillar: 'grid' },
  { id: 'm4', platform: 'twitter', content: 'Hot take: The next energy crisis won\'t be about generation. It\'ll be about transformers. We literally can\'t make them fast enough.\n\nLead times:\n• Large power transformers: 3-4 years\n• Distribution: 18-24 months\n\nEvery data center, every solar farm, every EV charger needs grid equipment we can\'t produce fast enough.', type: 'text', likes: 1400, retweets: 520, replies: 189, bookmarks: 340, timestamp: daysAgo(7), engagementRate: 4.5, pillar: 'grid' },
  { id: 'm5', platform: 'linkedin', content: 'We just shipped 96 API endpoints covering the US energy grid.\n\nInterconnection queues, generator data, congestion patterns, developer scores — all accessible via REST API.\n\nBuilt for analysts, researchers, and AI agents that need energy data.\n\nThe thesis: Most energy data is trapped in PDFs, spreadsheets, and FERC filings. We\'re setting it free.\n\nLink in comments 👇', type: 'text', likes: 445, retweets: 67, replies: 134, bookmarks: 89, timestamp: daysAgo(10), engagementRate: 3.2, pillar: 'build-in-public' },
];

// Draft posts
const MOCK_DRAFTS = [
  { id: 'd1', platform: 'twitter', content: 'I analyzed every interconnection project that completed in MISO since 2020.\n\nCompletion rate: 19%.\n\nBut here\'s the kicker: developers with 3+ completed projects have a 67% completion rate.\n\nFirst-time developers? 8%.\n\nThe queue isn\'t broken for everyone — just for the speculators.', pillar: 'grid', createdAt: daysAgo(0) },
  { id: 'd2', platform: 'linkedin', content: 'Everyone\'s talking about AI power demand.\n\nBut nobody\'s talking about AI power EFFICIENCY.\n\nThe compute per watt has improved 3x in 2 years.\n\nYes, total demand is rising. But the efficiency curve is steeper than the demand curve.\n\nHere\'s what that means for grid planning:', pillar: 'AI+energy', createdAt: daysAgo(0) },
];

// Topic Bank
const PILLARS = ['Grid', 'Minerals', 'AI+Energy', 'Geopolitics', 'Build-in-Public', 'Manufacturing'];
const POST_LEVELS = ['L1', 'L2', 'L3', 'L4'];
const TOPIC_TYPES = ['hot take', 'data reveal', 'thread', 'Loom', 'tool drop', 'analysis', 'news reaction', 'contrarian'];
const TOPIC_STATUSES = ['💡 Idea', '✍️ Drafting', '✅ Posted'];

const MOCK_TOPICS = [
  {
    id: 'topic1',
    title: 'AES $33B Take-Private — PE Meets Energy',
    description: 'Brookfield\'s $33B take-private of AES is the biggest energy PE deal ever. What it signals about the convergence of private capital and power infrastructure.',
    platform: 'Both',
    pillar: 'Grid',
    level: 'L3',
    type: 'analysis',
    status: '💡 Idea',
    createdAt: daysAgo(1),
    examples: [
      { platform: 'twitter', label: 'Twitter Quick Take (L1)', content: 'Brookfield just took AES private for $33 BILLION.\n\nThe largest PE deal in energy history.\n\nThis isn\'t a bet on renewables. It\'s a bet on grid infrastructure.\n\nAES owns 35 GW of generation + a massive development pipeline. PE sees what public markets don\'t: grid assets are the new gold.' },
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'The $33B AES take-private tells you everything about where energy investing is headed.\n\nBrookfield didn\'t pay a 30% premium for solar panels. They paid for:\n\n→ 35 GW of operating capacity\n→ Grid interconnection positions that take 5 years to get\n→ Utility relationships that can\'t be replicated\n→ A development pipeline that\'s already permitted\n\nPrivate capital is flooding into power infrastructure because the risk/reward has flipped. With 97 GW of new demand coming from data centers alone, owning grid-connected assets is the safest bet in energy.\n\nThe PE thesis has shifted from "build renewables" to "own the grid position."\n\nWhat does this mean for developers, utilities, and the interconnection queue? My analysis below 👇' },
      { platform: 'twitter', label: 'Twitter Thread (L3)', content: 'Brookfield just paid $33B to take AES private.\n\nThis is the most important deal in energy this decade.\n\nHere\'s what it means for the grid, developers, and your portfolio: 🧵\n\n1/ The headline says "renewable energy company." But AES isn\'t really a renewables play anymore...' },
    ],
  },
  {
    id: 'topic2',
    title: 'Battery Storage Lagging on the East Coast',
    description: 'Texas and California dominate battery installations. PJM, ISO-NE, and NYISO are way behind. Why and what it means for grid reliability.',
    platform: 'Both',
    pillar: 'Grid',
    level: 'L2',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(2),
    examples: [
      { platform: 'twitter', label: 'Twitter Data Drop (L2)', content: 'Battery storage installed in 2025 by region:\n\n→ ERCOT: 8.2 GW (38%)\n→ CAISO: 6.1 GW (29%)\n→ PJM: 1.4 GW (7%)\n→ ISO-NE: 0.3 GW (1.4%)\n→ NYISO: 0.5 GW (2.3%)\n\nThe East Coast has the most grid stress and the least storage. This is a ticking time bomb for summer reliability.' },
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'Everyone talks about the battery storage boom.\n\nBut zoom into the data and it\'s a tale of two countries.\n\nTexas and California have 67% of all US battery capacity. The entire East Coast — PJM, ISO-NE, NYISO — has 11%.\n\nWhy? Three factors:\n\n1. Interconnection speed: ERCOT approves projects 2x faster\n2. Market design: ERCOT\'s real-time pricing rewards batteries more\n3. Permitting: Fewer jurisdictional layers in single-state ISOs\n\nFor investors: the opportunity is in the gap. East Coast storage will have to catch up. The companies positioning there now will benefit from scarcity premiums.' },
    ],
  },
  {
    id: 'topic3',
    title: 'MISO Interconnection Queue — 19% Completion Rate',
    description: 'Developer completion rates in MISO collapsed from 31% to 19% in 3 years. Speculative projects are choking the queue.',
    platform: 'twitter',
    pillar: 'Grid',
    level: 'L3',
    type: 'thread',
    status: '✍️ Drafting',
    createdAt: daysAgo(3),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'I analyzed every interconnection project that completed in MISO since 2020.\n\nCompletion rate: 19%. Down from 31% in 2021.\n\nBut here\'s the kicker: developers with 3+ completed projects have a 67% completion rate. First-timers? 8%.\n\nThe queue isn\'t broken for everyone — just for the speculators. 🧵' },
      { platform: 'twitter', label: 'Quick Take (L1)', content: 'MISO interconnection completion rate has fallen to 19%.\n\nThat means 4 out of 5 proposed projects will never get built.\n\nThe queue is a parking lot, not a pipeline.' },
    ],
  },
  {
    id: 'topic4',
    title: 'China Controls 90%+ of Critical Mineral Processing',
    description: 'Despite mining happening globally, China dominates processing for lithium, cobalt, rare earths, and graphite. Visualize the dependency.',
    platform: 'Both',
    pillar: 'Minerals',
    level: 'L2',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(4),
    examples: [
      { platform: 'twitter', label: 'Twitter Visual (L2)', content: 'China\'s share of critical mineral PROCESSING:\n\n→ Rare earths: 92%\n→ Graphite: 93%\n→ Lithium (refined): 73%\n→ Cobalt (refined): 74%\n→ Gallium: 98%\n→ Germanium: 83%\n\nMining happens everywhere. Processing happens in China.\n\nThis is the real supply chain risk. Not who digs it up — who refines it.\n\n[chart]' },
      { platform: 'linkedin', label: 'LinkedIn Deep Dive (L3)', content: 'There\'s a common misconception about critical minerals.\n\nPeople think the risk is mining — who controls the deposits.\n\nThe actual risk is processing. And the data is stark:\n\nChina processes 92% of the world\'s rare earths, 93% of graphite, and 73% of lithium.\n\nEven when minerals are mined in Australia, Congo, or Chile — they go to China for refining.\n\nThe IRA is trying to change this with domestic processing incentives. But building chemical processing plants takes 5-7 years.\n\nWe tracked every announced processing facility in the US. Here\'s the reality check on the reshoring timeline.' },
      { platform: 'twitter', label: 'Hot Take (L1)', content: 'The US doesn\'t have a mining problem.\n\nIt has a processing problem.\n\nChina doesn\'t mine most critical minerals. It REFINES them.\n\nWe can dig all the lithium we want. If we can\'t process it, we\'re still dependent.' },
    ],
  },
  {
    id: 'topic5',
    title: 'Google + Xcel Energy Grid Battery Partnership',
    description: 'Google is partnering with utilities to co-locate batteries at data centers and share grid services. A new model for AI + grid.',
    platform: 'Both',
    pillar: 'AI+Energy',
    level: 'L2',
    type: 'news reaction',
    status: '💡 Idea',
    createdAt: daysAgo(2),
    examples: [
      { platform: 'twitter', label: 'Twitter Reaction (L1)', content: 'Google just partnered with Xcel Energy to put grid-scale batteries AT their data centers.\n\nThe batteries serve the grid during peak demand. Google gets reliability.\n\nThis is the template. Hyperscalers become grid assets, not grid liabilities.\n\nWatch every major tech company copy this within 12 months.' },
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'The Google-Xcel battery partnership just created a new category.\n\nInstead of data centers being a drain on the grid, they become grid assets.\n\nThe model:\n→ Google co-locates batteries at data centers\n→ Batteries provide grid services during peak demand\n→ Google gets backup power and reliability\n→ Xcel gets flexible capacity without building new plants\n→ Ratepayers benefit from reduced peak costs\n\nThis is brilliant because it aligns incentives. Tech companies need reliable power. Utilities need flexible capacity. The battery sits in the middle serving both.\n\nPrediction: This becomes the standard model for data center interconnection within 2 years.' },
    ],
  },
  {
    id: 'topic6',
    title: 'EU Solar Manufacturing Domestic Content Rules',
    description: 'EU is implementing domestic content requirements for solar installations. How this compares to US IRA approach and what it means for global supply chains.',
    platform: 'linkedin',
    pillar: 'Geopolitics',
    level: 'L2',
    type: 'analysis',
    status: '💡 Idea',
    createdAt: daysAgo(5),
    examples: [
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'The EU just went protectionist on solar.\n\nNew domestic content requirements mean solar installations must source a minimum percentage from European manufacturers.\n\nSound familiar? It\'s the IRA playbook.\n\nBut there\'s a critical difference:\n\n→ The US used carrots (tax credits for domestic content)\n→ The EU is using sticks (requirements with penalties)\n\nThe US approach is working better. Why? Because there isn\'t enough European manufacturing capacity yet. Requirements without supply = higher costs.\n\nThis is going to raise solar installation costs in Europe by 15-25% in the short term. The question is whether it catalyzes enough manufacturing investment to close the gap.\n\nHistorically, protectionism in clean energy has had mixed results. India\'s domestic content requirements slowed solar deployment by 2 years.' },
      { platform: 'twitter', label: 'Twitter Take (L1)', content: 'EU just announced domestic content rules for solar.\n\nUS approach: Tax credits if you buy domestic (carrots)\nEU approach: You MUST buy domestic (sticks)\n\nThe US has carrots. The EU has sticks.\n\nProblem: There isn\'t enough EU manufacturing capacity to meet the requirements.\n\nSolar costs in Europe about to go up 15-25%.' },
    ],
  },
  {
    id: 'topic7',
    title: 'Interconnection Completion Rates by Developer',
    description: 'Score every developer in the queue by completion rate, average timeline, and geographic spread. Name names.',
    platform: 'twitter',
    pillar: 'Grid',
    level: 'L3',
    type: 'data reveal',
    status: '✍️ Drafting',
    createdAt: daysAgo(3),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'I scored every developer in the US interconnection queue.\n\nCompletion rate. Average timeline. Dropout rate. Geographic spread.\n\nSome "developers" have 50+ projects and a 0% completion rate.\n\nHere are the results — and what they mean for the $2.6T queue backlog: 🧵' },
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'Developer Reliability Scores — Top 10:\n\n1. NextEra: 67% completion, 2.8yr avg\n2. AES: 54% completion, 3.1yr avg\n3. Invenergy: 51% completion, 3.4yr avg\n...\n\nBottom 10 all have <5% completion rates with 20+ active projects.\n\nThe queue would clear 40% faster if speculative developers were removed.' },
    ],
  },
  {
    id: 'topic8',
    title: '"I Built 12 Energy Data Tools in 18 Months"',
    description: 'Build-in-public story of the Prospector Labs tool suite. Revenue, stack, lessons, what\'s next.',
    platform: 'Both',
    pillar: 'Build-in-Public',
    level: 'L3',
    type: 'thread',
    status: '💡 Idea',
    createdAt: daysAgo(1),
    examples: [
      { platform: 'twitter', label: 'Twitter Thread (L3)', content: 'I built 12 energy data tools in 18 months.\n\nNo VC. No team (at first). Just a laptop and too many FERC filings.\n\nHere\'s what I built, what worked, and what I\'d do differently: 🧵\n\n1/ It started with a simple question: Why is interconnection data trapped in PDFs?' },
      { platform: 'linkedin', label: 'LinkedIn Story (L3)', content: '18 months ago, I started building data tools for the energy industry.\n\nThe thesis was simple: Most critical energy data is trapped in PDFs, FERC filings, and utility spreadsheets. Nobody had made it accessible.\n\nToday, Prospector Labs has 12 tools, 96 API endpoints, and serves analysts at PE firms, utilities, and developers.\n\nHere are the 5 biggest lessons from building in a "boring" industry:\n\n1. Domain expertise > engineering talent in specialized markets\n2. The hardest part isn\'t building — it\'s data cleaning\n3. B2B energy customers will pay for good data (the margins are real)\n4. Free tools drive paid conversions at 8x the rate of content marketing\n5. The energy industry is 10 years behind tech — that\'s the opportunity\n\nWhat surprised me most? How hungry this market is for modern data tools. The bar is so low that "making data accessible in a browser" feels revolutionary.' },
    ],
  },
  {
    id: 'topic9',
    title: 'Transformer Shortage — The Bottleneck Nobody Talks About',
    description: 'Large power transformer lead times are 3-4 years. This is THE bottleneck for everything: solar, data centers, grid upgrades.',
    platform: 'Both',
    pillar: 'Manufacturing',
    level: 'L2',
    type: 'contrarian',
    status: '✅ Posted',
    createdAt: daysAgo(7),
    examples: [
      { platform: 'twitter', label: 'Twitter Hot Take (L1)', content: 'Hot take: The next energy crisis won\'t be about generation.\n\nIt\'ll be about transformers.\n\nLead times: 3-4 YEARS for large power transformers.\n\nEvery solar farm, data center, and grid upgrade needs one. We can\'t make them fast enough.\n\nThis is the actual bottleneck and nobody talks about it.' },
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'Everyone\'s focused on generation capacity. But the real bottleneck is hiding in plain sight.\n\nLarge power transformer lead times:\n→ 2020: 12-18 months\n→ 2023: 24-30 months\n→ 2026: 36-48 months\n\nWe have 97 GW of new demand coming. Every single GW needs transformer capacity.\n\nThe US has only 3 domestic manufacturers of large power transformers. The rest comes from imports — primarily from South Korea, Germany, and Japan.\n\nThis isn\'t just an energy problem. It\'s a national security problem. A single transformer failure at a major substation can take months to replace.\n\nThe DOE just invoked the Defense Production Act for transformers. But scaling manufacturing takes years, not months.\n\nThe companies solving this — whether through new manufacturing, grid-enhancing technologies, or modular designs — are sitting on a goldmine.' },
    ],
  },
  {
    id: 'topic10',
    title: 'Data Center Power Demand Revisions Keep Going UP',
    description: 'Every 6 months, the data center power demand forecast gets revised higher. Track the revisions and what they mean for grid planning.',
    platform: 'twitter',
    pillar: 'AI+Energy',
    level: 'L2',
    type: 'data reveal',
    status: '✅ Posted',
    createdAt: daysAgo(9),
    examples: [
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'Data center power demand projections keep getting revised UP:\n\n2024 forecast: 35 GW by 2030\n2025 forecast: 52 GW by 2030\n2026 forecast: 74 GW by 2030\n\nThat\'s the equivalent of adding the entire ERCOT grid just for data centers.\n\nEvery time someone says "this is peak AI demand," the next quarter proves them wrong.' },
    ],
  },
  {
    id: 'topic11',
    title: 'FERC Transmission Planning Overhaul',
    description: 'FERC just approved a 20-year planning horizon for transmission. This could unlock $100B+ but implementation will be messy.',
    platform: 'Both',
    pillar: 'Grid',
    level: 'L2',
    type: 'news reaction',
    status: '💡 Idea',
    createdAt: daysAgo(4),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'FERC just approved the biggest transmission planning reform in a decade.\n\nKey changes:\n1. 20-year planning horizon (up from 10)\n2. States must share costs for multi-state lines\n3. Grid-enhancing technologies get priority\n\nThis could unlock $100B+ in new transmission.\n\nBut implementation will take years. Here\'s why 👇' },
      { platform: 'twitter', label: 'Hot Take (L1)', content: 'FERC just told ISOs to plan 20 years out instead of 10.\n\nThis is huge. The current planning horizon is why we\'re always building for yesterday\'s grid.\n\nBut here\'s the thing: FERC can make the rule. States have to fund it. That\'s where it gets ugly.' },
    ],
  },
  {
    id: 'topic12',
    title: 'Solar Surpassed Coal in Feb 2026',
    description: 'Solar generated more electricity than coal for the first time in February. Historic milestone buried in EIA data.',
    platform: 'Both',
    pillar: 'Grid',
    level: 'L1',
    type: 'news reaction',
    status: '💡 Idea',
    createdAt: daysAgo(1),
    examples: [
      { platform: 'twitter', label: 'Quick Take (L1)', content: 'Solar just passed coal for the first time in US history.\n\nFebruary 2026:\n→ Solar: 14.2% of generation\n→ Coal: 13.8%\n\nThis wasn\'t even news. It was buried in an EIA data release.\n\nThat\'s how you know the transition is real — when the milestones stop being headlines.' },
      { platform: 'linkedin', label: 'LinkedIn Post (L2)', content: 'A historic milestone happened last month and almost nobody noticed.\n\nSolar electricity generation in the US exceeded coal for the first time ever.\n\nFebruary 2026: Solar at 14.2%, coal at 13.8%.\n\nWhat makes this remarkable isn\'t the milestone itself — it\'s that it was buried in a routine EIA data release. No press conferences. No celebrations.\n\nThe energy transition isn\'t happening through announcements. It\'s happening through data.\n\nThe trajectory is clear. Coal was 45% of US generation in 2010. Now it\'s below solar. That\'s a structural shift, not a blip.' },
    ],
  },
  {
    id: 'topic13',
    title: 'Copper Is the New Oil',
    description: 'Copper supply deficit projections, price implications, and why every energy transition pathway depends on a metal we don\'t have enough of.',
    platform: 'twitter',
    pillar: 'Minerals',
    level: 'L2',
    type: 'analysis',
    status: '💡 Idea',
    createdAt: daysAgo(6),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'Copper is the new oil.\n\nAnd we don\'t have enough.\n\nPrice: $4.85/lb (near ATH)\nProjected deficit by 2027: 8M tonnes\nNew mine development time: 15-20 YEARS\n\nEvery EV, solar panel, wind turbine, data center, and grid upgrade needs copper.\n\nHere\'s why this could derail the energy transition: 🧵' },
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'Copper demand by sector (2026-2030 growth):\n\n→ EVs: +4.2M tonnes\n→ Grid infrastructure: +3.8M tonnes\n→ Data centers: +1.9M tonnes\n→ Renewables: +2.1M tonnes\n→ Traditional: +0.5M tonnes\n\nTotal new demand: 12.5M tonnes\nNew supply coming online: 4.5M tonnes\n\nDeficit: 8M tonnes\n\nThere is no energy transition without copper. And we don\'t have enough.' },
    ],
  },
  {
    id: 'topic14',
    title: 'IRA Impact — Announced vs Built vs Operational',
    description: 'The gap between announced IRA projects and actually operational ones is massive. Show the data.',
    platform: 'Both',
    pillar: 'Geopolitics',
    level: 'L3',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(5),
    examples: [
      { platform: 'twitter', label: 'Thread Hook', content: 'I spent 200 hours tracking every clean energy project announced since the IRA passed.\n\n$340B in announcements.\n38% have broken ground.\n12% are operational.\n\nThe gap between ambition and reality is enormous. Here\'s what the data shows: 🧵' },
      { platform: 'linkedin', label: 'LinkedIn Post (L3)', content: 'The IRA was signed 3.5 years ago. Time for a reality check.\n\nI tracked every major clean energy and manufacturing project announced since August 2022.\n\nThe numbers:\n→ $340B in announced investments\n→ 38% have broken ground\n→ 12% are operational\n→ 8% are delayed or paused\n→ 4% quietly cancelled\n\nThe biggest bottlenecks aren\'t what you think:\n\n1. Permitting (still #1 — average 2.5 years for industrial facilities)\n2. Workforce (500K worker gap in clean energy construction)\n3. Supply chain (equipment delivery delays of 12-18 months)\n4. Grid interconnection (can\'t power a factory without grid access)\n\nThe IRA created the incentive. The physical world hasn\'t caught up.' },
    ],
  },
  {
    id: 'topic15',
    title: 'Prospector Labs API Launch — 96 Endpoints',
    description: 'We just shipped a free API with 96 endpoints covering the US energy grid. Announce the launch, show the docs, explain the thesis.',
    platform: 'Both',
    pillar: 'Build-in-Public',
    level: 'L2',
    type: 'tool drop',
    status: '✅ Posted',
    createdAt: daysAgo(10),
    examples: [
      { platform: 'twitter', label: 'Tool Drop (L2)', content: 'I just shipped a free API with 96 endpoints covering the US energy grid.\n\nInterconnection queues. Generator data. Congestion patterns. Developer scores.\n\nBuilt for analysts, researchers, and AI agents.\n\nThe thesis: Most energy data is trapped in PDFs. We\'re setting it free.\n\n[screenshot + link in reply]' },
      { platform: 'linkedin', label: 'LinkedIn Launch (L2)', content: 'We just shipped something I\'ve been building for a year.\n\nA free API with 96 endpoints covering the US energy grid.\n\n→ Interconnection queue data (35K+ projects)\n→ Generator operating data\n→ Grid congestion patterns\n→ Developer reliability scores\n→ Capacity market data\n\nWhy free? Because the biggest problem in energy isn\'t data access — it\'s that the data is trapped in formats nobody can use.\n\nFERC filings. ISO spreadsheets. Utility PDFs.\n\nWe scraped, cleaned, and structured it all. Now it\'s one API call away.\n\nLink in comments 👇' },
    ],
  },
  {
    id: 'topic16',
    title: 'Nuclear Renaissance — 90% Hype, 10% Reality',
    description: 'Hot contrarian take: SMRs are still 5+ years out, new large nuclear is $15B+. The real story is existing fleet extensions.',
    platform: 'twitter',
    pillar: 'Grid',
    level: 'L2',
    type: 'contrarian',
    status: '💡 Idea',
    createdAt: daysAgo(3),
    examples: [
      { platform: 'twitter', label: 'Hot Take (L2)', content: 'Hot take: The "nuclear renaissance" is 90% hype, 10% reality.\n\nSMRs: Still 5+ years from commercial operation\nNew large nuclear: $15B+ per plant\nVogtle overruns: 2x budget, 7 years late\n\nWhat IS real:\n→ Life extensions of existing fleet\n→ Uprates adding 1-2 GW\n→ Data center PPAs keeping plants open\n\nThe grid needs existing nuclear. New nuclear is a 2035+ story.' },
      { platform: 'twitter', label: 'Thread (L3)', content: 'Everyone\'s excited about the nuclear renaissance.\n\nI looked at the data.\n\nThe reality is... complicated. 🧵\n\n1/ Let\'s start with what\'s actually happening vs. what\'s being announced...' },
    ],
  },
  {
    id: 'topic17',
    title: 'California Curtailed 4 TWh of Solar in 2025',
    description: 'California threw away enough solar electricity to power 380K homes. The transmission bottleneck visualized.',
    platform: 'twitter',
    pillar: 'Grid',
    level: 'L2',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(5),
    examples: [
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'California curtailed 4.1 TWh of solar in 2025.\n\nThat\'s enough to power 380,000 homes for a year.\n\nJust... thrown away. Because we can\'t move it where it\'s needed.\n\nTransmission is the bottleneck. Storage is the band-aid. Both need to scale 5x.\n\n[chart of curtailment by month]' },
    ],
  },
  {
    id: 'topic18',
    title: 'Grid Congestion Heatmap — Where to Build',
    description: 'Loom walkthrough of the congestion heatmap tool. Show real data, explain what it means for siting decisions.',
    platform: 'linkedin',
    pillar: 'Build-in-Public',
    level: 'L3',
    type: 'Loom',
    status: '💡 Idea',
    createdAt: daysAgo(2),
    examples: [
      { platform: 'linkedin', label: 'Loom Walkthrough (L3)', content: 'I built a real-time grid congestion heatmap.\n\n3-minute walkthrough showing:\n→ Where the grid is most congested right now\n→ How congestion patterns shift by season\n→ What this means for siting solar, storage, and data centers\n→ Why some developers are making millions on congestion arbitrage\n\nIf you\'re making siting decisions for energy projects, this is the tool I wish I had 5 years ago.\n\n[Loom video]\n\nLink to try it free in comments 👇' },
    ],
  },
  {
    id: 'topic19',
    title: 'Battery Gigafactory Tracker — Who\'s On Track',
    description: '47 battery factories announced since IRA. 12 on track. 8 delayed. 6 paused. Track every single one.',
    platform: 'Both',
    pillar: 'Manufacturing',
    level: 'L2',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(4),
    examples: [
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'Battery gigafactory scorecard — March 2026:\n\n47 announced since IRA\n→ 12 on track ✅\n→ 8 behind schedule ⚠️\n→ 6 "paused indefinitely" 🔴\n→ 5 quietly cancelled ❌\n→ 16 too early to tell\n\nThe gap between press releases and reality is where the money gets made.\n\n[map visualization]' },
      { platform: 'linkedin', label: 'LinkedIn Post (L2)', content: 'The US has announced 47 battery gigafactories since the IRA passed.\n\n12 are on track. 8 are delayed. 6 are "paused indefinitely."\n\nI\'ve been tracking every single one — construction permits, workforce hiring, equipment orders, grid interconnection status.\n\nThe data tells a nuanced story. The factories that are succeeding share 3 characteristics:\n\n1. Located near existing auto manufacturing workforce\n2. Secured grid interconnection before breaking ground\n3. Partnered with an established OEM (not speculative demand)\n\nThe ones struggling? Usually missing at least two of those three.\n\nFull tracker in comments 👇' },
    ],
  },
  {
    id: 'topic20',
    title: 'Methane Emissions 70% Higher Than Official Data',
    description: 'New satellite data reveals massive undercount in global methane inventories. Permian Basin is a hotspot.',
    platform: 'Both',
    pillar: 'Geopolitics',
    level: 'L2',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(6),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'New satellite data just dropped.\n\nGlobal methane emissions are 70% HIGHER than official inventories.\n\nThe worst offenders: oil & gas production in Permian Basin, Russia, Turkmenistan.\n\nBut here\'s the opportunity: cutting methane is the fastest way to slow warming.\n\n80x more potent than CO2 over 20 years. 🧵' },
      { platform: 'twitter', label: 'Quick Take (L1)', content: 'Satellites just caught the Permian Basin red-handed.\n\nMethane emissions 70% higher than what operators self-report.\n\nSelf-reporting is a joke. Satellite monitoring should be mandatory.\n\nThe good news: methane is the lowest-hanging fruit in climate. Fix the leaks.' },
    ],
  },
  {
    id: 'topic21',
    title: 'LCOE Update — Gas Now More Expensive Than Solar+Storage',
    description: 'Updated levelized cost analysis. Solar + 4hr storage at $45/MWh is now cheaper than natural gas CC at $62/MWh in most markets.',
    platform: 'twitter',
    pillar: 'Grid',
    level: 'L3',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(3),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'I updated our LCOE analysis with 2026 data.\n\nThe ranking changed.\n\n1. Solar + 4hr storage: $45/MWh (↓18%)\n2. Onshore wind: $38/MWh\n3. Natural gas CC: $62/MWh (↑15%)\n4. Existing nuclear: $33/MWh (cheapest!)\n5. New SMR: $89/MWh\n\nThe surprise? Gas is now MORE expensive than solar+storage. 🧵' },
    ],
  },
  {
    id: 'topic22',
    title: 'Permitting Reform Scorecard by State',
    description: 'Which states are fastest/slowest for energy project permitting. Rank all 50 with data.',
    platform: 'Both',
    pillar: 'Geopolitics',
    level: 'L3',
    type: 'data reveal',
    status: '💡 Idea',
    createdAt: daysAgo(8),
    examples: [
      { platform: 'twitter', label: 'Data Tease (L2)', content: 'Average energy project permitting time by state:\n\nFastest:\n1. Texas: 8 months\n2. Indiana: 11 months\n3. Oklahoma: 12 months\n\nSlowest:\n48. California: 34 months\n49. New York: 38 months\n50. Massachusetts: 41 months\n\nThe clean energy transition is a state-by-state story. Full scorecard in thread 👇' },
    ],
  },
  {
    id: 'topic23',
    title: 'AI Inference Energy Efficiency Is Improving 3x Every 2 Years',
    description: 'Counter-narrative to "AI is eating the grid." Yes demand is up, but compute per watt is improving faster than most realize.',
    platform: 'Both',
    pillar: 'AI+Energy',
    level: 'L2',
    type: 'contrarian',
    status: '💡 Idea',
    createdAt: daysAgo(2),
    examples: [
      { platform: 'twitter', label: 'Contrarian Take (L2)', content: 'Everyone\'s panicking about AI power demand.\n\nBut nobody\'s looking at the efficiency curve.\n\nCompute per watt has improved 3x in 2 years.\n\nYes, total demand is rising. But the efficiency gains are steeper than the demand curve.\n\nThe grid problem is real but it\'s a 5-year problem, not a permanent one.\n\nHere\'s the data 👇' },
      { platform: 'linkedin', label: 'LinkedIn Analysis (L2)', content: 'The narrative: AI is going to crash the grid.\n\nThe reality is more nuanced.\n\nYes, data center demand is surging — 74 GW projected by 2030. That\'s massive.\n\nBut there\'s a counter-trend that nobody is discussing: AI inference efficiency.\n\nCompute per watt has improved 3x in just 2 years. New chip architectures (including Apple\'s M-series, NVIDIA\'s Blackwell) are dramatically more efficient.\n\nWhat does this mean?\n\nTotal demand will keep rising. But the growth RATE will slow as efficiency gains compound.\n\nThe grid planning challenge is real — but it\'s a capacity timing problem, not a permanent crisis.\n\nThe real question: Can we build fast enough for the next 5 years? After that, efficiency catches up.' },
    ],
  },
  {
    id: 'topic24',
    title: 'The Content Ladder — One Insight, 10 Posts',
    description: 'Meta-content: Show how one data insight becomes 10 posts across platforms. Teach the framework.',
    platform: 'twitter',
    pillar: 'Build-in-Public',
    level: 'L2',
    type: 'thread',
    status: '💡 Idea',
    createdAt: daysAgo(1),
    examples: [
      { platform: 'twitter', label: 'Thread (L3)', content: 'One insight. 10 posts. 2 platforms. 2 weeks of content.\n\nHere\'s the exact framework I use to turn a single data point into a content machine:\n\n1/ Start with the insight: "MISO completion rates dropped from 31% to 19%"\n\n2/ Write the deep dive (X Article or LinkedIn Newsletter)\n\n3/ Break it into a thread (5-7 tweets)\n\n4/ Pull 3 standalone charts/stats\n\n5/ React to related news with your data\n\n6/ Turn it into a LinkedIn carousel\n\nOne piece of research = 10 posts. This is how you stay consistent without burning out. 🧵' },
    ],
  },
  {
    id: 'topic25',
    title: 'Rooftop Solar Economics 2026 — Net Metering Under Attack',
    description: 'Rooftop solar payback is 5.8 years but 12 states are gutting net metering. The policy fight is where the action is.',
    platform: 'Both',
    pillar: 'Geopolitics',
    level: 'L2',
    type: 'analysis',
    status: '💡 Idea',
    createdAt: daysAgo(7),
    examples: [
      { platform: 'twitter', label: 'Data Drop (L2)', content: 'Rooftop solar economics in 2026:\n\n→ Avg system cost: $2.50/W (↓12% YoY)\n→ Avg payback: 5.8 years\n→ Best states: TX, FL, CA, AZ, NV\n→ Net metering under attack in 12 states\n\nThe technology is cheaper than ever. The policy fight is where the action is.\n\nStates rolling back net metering will see rooftop installations drop 40%+ within 2 years.' },
    ],
  },
];

// Goals
const MOCK_GOALS = {
  twitter: { target: 7, period: 'week', current: 4, label: 'Twitter posts/week' },
  linkedin: { target: 3, period: 'week', current: 2, label: 'LinkedIn posts/week' },
  engagement: { target: 35, period: 'week', current: 22, label: 'Comments on others\' posts' },
};

// Settings
const DEFAULT_SETTINGS = {
  twitterApiKey: '',
  twitterApiProvider: 'twitter-api45',
  linkedinApiKey: '',
  linkedinApiProvider: 'linkedin-data-api',
  rapidApiKey: '',
  bufferApiKey: '3tvNQCHMNmsTTm4i1gFBJMtpS-MvTHB6ythigBiYqpa',
  darkMode: true,
  refreshInterval: 30, // minutes
};
