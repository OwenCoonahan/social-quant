// Social Quant — Seed/Mock Data
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
  
  // LinkedIn posts
  { id: 'p18', accountId: 'l1', platform: 'linkedin', content: 'Energy storage is having its "solar 2015" moment.\n\nCosts have fallen 40% in 2 years. Deployment is up 200% YoY. And utilities are finally signing 10-year contracts.\n\nBut here\'s what most people miss about the storage market:\n\nThe value stack is shifting.\n\nTwo years ago, arbitrage was the primary revenue stream. Today, capacity payments and ancillary services make up 60% of storage revenue.\n\nThis changes everything about project economics.\n\n3 things I\'m watching:\n\n1. Duration is getting longer — 4-hour batteries are the new standard, 8-hour is coming fast\n2. Co-location with solar is becoming the default, not the exception\n3. The merchant risk appetite is growing as developers get more sophisticated\n\nThe companies that figure out the software stack for storage optimization will capture most of the value.\n\nWhat trends are you seeing in storage? 👇', type: 'text', likes: 890, retweets: 156, replies: 234, bookmarks: 120, timestamp: daysAgo(1), engagementRate: 5.2 },
  
  { id: 'p19', accountId: 'l2', platform: 'linkedin', content: 'The DOE Loan Programs Office has now committed over $45 billion since 2021.\n\nHere\'s what we\'re seeing in applications right now:\n\n→ Nuclear: Applications up 300% since 2024\n→ Critical minerals processing: Fastest growing category\n→ Grid infrastructure: Transformer manufacturing is the new hot sector\n→ Geothermal: Next-gen projects are finally bankable\n\nThe common thread? These are all technologies that private capital alone won\'t fund at the speed we need.\n\nThat\'s exactly what LPO was built for.\n\nThe energy transition isn\'t just about solar and wind anymore. It\'s about the entire supply chain — from mining to manufacturing to the grid that connects it all.\n\nWe\'re open for business. If you\'re building critical infrastructure, talk to us.\n\n#CleanEnergy #Infrastructure #DOE', type: 'text', likes: 2400, retweets: 445, replies: 567, bookmarks: 312, timestamp: daysAgo(2), engagementRate: 6.8 },
  
  { id: 'p20', accountId: 'l3', platform: 'linkedin', content: 'I\'ve spent 20 years in the energy industry.\n\nThe last 3 years have seen more change than the previous 17 combined.\n\nHere are 5 shifts that fundamentally changed the clean energy landscape:\n\n1. The IRA made the US the most attractive clean energy market globally\n2. Supply chain reshoring went from "nice to have" to "national security"\n3. AI power demand turned data centers into the largest new electricity consumers\n4. Battery storage went from niche to necessity\n5. The workforce gap became the #1 bottleneck\n\nThe technology works. The economics work. The policy works.\n\nThe constraint now is people. We need 500,000+ workers in clean energy by 2030.\n\nHow are you thinking about talent in this space?', type: 'text', likes: 670, retweets: 89, replies: 156, bookmarks: 78, timestamp: daysAgo(3), engagementRate: 4.1 },
  
  { id: 'p21', accountId: 'l4', platform: 'linkedin', content: 'PE in power infrastructure is having a moment.\n\nOur latest analysis of deal flow:\n\n→ Transaction volume up 45% YoY\n→ Average deal size: $380M (up from $240M in 2023)\n→ Hottest sectors: Battery storage, grid services, data center power\n→ Multiple compression in renewables but expansion in "grid edge"\n\nThe thesis has shifted from "build renewables" to "fix the grid."\n\nDevelopers with interconnection expertise and utility relationships are commanding premium valuations.\n\nThe question for 2026: Does the compressed timeline for data center power demand create opportunity or risk?\n\nBoth. And it depends entirely on your grid position.', type: 'text', likes: 445, retweets: 67, replies: 98, bookmarks: 89, timestamp: daysAgo(4), engagementRate: 3.5 },
  
  // More Twitter posts for richer feed
  { id: 'p22', accountId: 't4', platform: 'twitter', content: 'Thread: The real cost of electricity by source in 2026\n\nI updated our LCOE analysis with latest data.\n\nSpoiler: The ranking changed.\n\n1/ Solar + 4hr storage: $45/MWh (down 18% from 2024)\n2/ Onshore wind: $38/MWh\n3/ Natural gas CC: $62/MWh (up 15% — fuel costs)\n4/ Nuclear (existing): $33/MWh (cheapest! But no new builds at this cost)\n5/ Nuclear (new SMR): $89/MWh (still expensive)\n\nThe surprise? Gas is now MORE expensive than solar+storage in most markets.', type: 'thread', likes: 8900, retweets: 3200, replies: 1200, bookmarks: 2800, timestamp: daysAgo(6), engagementRate: 7.4 },
  
  { id: 'p23', accountId: 't6', platform: 'twitter', content: 'I built 14 products last year.\n\n3 make money.\n11 are dead.\n\nThat\'s a 21% success rate.\n\nBut those 3 products make $5M/month combined.\n\nThe lesson: Ship fast, kill fast, double down on winners.\n\nMost people spend 1 year building 1 thing that might not work.\n\nShip 14 things in that year instead.', type: 'text', likes: 24000, retweets: 6800, replies: 2100, bookmarks: 8500, timestamp: daysAgo(5), engagementRate: 10.2 },
  
  { id: 'p24', accountId: 't1', platform: 'twitter', content: 'California curtailed 4.1 TWh of solar in 2025.\n\nThat\'s enough electricity to power 380,000 homes for a year.\n\nJust... thrown away.\n\nBecause we can\'t move it to where it\'s needed fast enough.\n\nTransmission is the bottleneck. Storage is the band-aid. Both need to scale 5x.', type: 'image', likes: 4500, retweets: 1600, replies: 456, bookmarks: 980, timestamp: daysAgo(5), engagementRate: 6.1 },
  
  { id: 'p25', accountId: 't5', platform: 'twitter', content: 'New data from the battery supply chain:\n\nChina controls:\n→ 78% of cathode production\n→ 92% of anode production\n→ 85% of electrolyte production\n→ 70% of cell manufacturing\n\nThe IRA is trying to change this. But building a parallel supply chain takes a decade.\n\nWe\'re not even at year 4.', type: 'image', likes: 3800, retweets: 1400, replies: 345, bookmarks: 890, timestamp: daysAgo(7), engagementRate: 6.9 },
  
  { id: 'p26', accountId: 't9', platform: 'twitter', content: 'The most underappreciated chart in energy:\n\nUS electricity demand growth by driver (2024-2030, projected):\n\n→ Data centers: +74 GW\n→ EVs: +18 GW\n→ Heat pumps: +12 GW\n→ Industrial reshoring: +8 GW\n→ Efficiency gains: -15 GW\n\nNet new demand: ~97 GW\n\nWe haven\'t built 97 GW in a decade. We need to do it in 5 years.', type: 'image', likes: 5200, retweets: 1900, replies: 567, bookmarks: 1400, timestamp: daysAgo(8), engagementRate: 7.8 },
  
  { id: 'p27', accountId: 't7', platform: 'twitter', content: 'Copper is the new oil.\n\nPrice: $4.85/lb (near all-time highs)\nSupply deficit by 2027: 8 million tonnes\nNew mine development time: 15-20 years\n\nEvery EV, solar panel, wind turbine, data center, and grid upgrade needs copper.\n\nAnd we don\'t have enough.', type: 'text', likes: 2100, retweets: 780, replies: 234, bookmarks: 567, timestamp: daysAgo(9), engagementRate: 4.8 },
  
  { id: 'p28', accountId: 't8', platform: 'twitter', content: 'Rooftop solar economics in 2026:\n\n→ Average system cost: $2.50/W (down 12% YoY)\n→ Average payback period: 5.8 years\n→ States with best economics: TX, FL, CA, AZ, NV\n→ Net metering under attack in 12 states\n\nThe technology is cheaper than ever. The policy fight is where the action is.', type: 'image', likes: 2800, retweets: 890, replies: 278, bookmarks: 567, timestamp: daysAgo(10), engagementRate: 4.5 },
  
  { id: 'p29', accountId: 'l2', platform: 'linkedin', content: 'Big announcement: LPO just closed a $6.5 billion conditional commitment for the largest grid-scale battery manufacturing facility in North America.\n\n→ 50 GWh annual production capacity\n→ 3,200 permanent jobs\n→ Located in Georgia\n→ Operational by 2028\n\nThis is what industrial policy looks like in practice.\n\nThe US is building its own battery supply chain. It\'s happening. It\'s real. And it\'s accelerating.\n\nMore details in the press release (link in comments).', type: 'text', likes: 4500, retweets: 890, replies: 678, bookmarks: 445, timestamp: daysAgo(5), engagementRate: 7.2 },
  
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
  darkMode: true,
  refreshInterval: 30, // minutes
};
