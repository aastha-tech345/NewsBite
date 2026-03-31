require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Ad = require('../models/Ad');

const agents = [
  { name: 'BBC News', rssUrl: 'http://feeds.bbci.co.uk/news/rss.xml', category: 'world', fetchInterval: 1 },
  { name: 'NYT World', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'world', fetchInterval: 1 },
  { name: 'CNN Top Stories', rssUrl: 'http://rss.cnn.com/rss/edition.rss', category: 'world', fetchInterval: 1 },
  { name: 'TechCrunch', rssUrl: 'https://techcrunch.com/feed/', category: 'technology', fetchInterval: 1 },
  { name: 'The Verge', rssUrl: 'https://www.theverge.com/rss/index.xml', category: 'technology', fetchInterval: 1 },
  { name: 'Wired', rssUrl: 'https://www.wired.com/feed/rss', category: 'technology', fetchInterval: 1 },
  { name: 'NYT Business', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'business', fetchInterval: 1 },
];

const ads = [
  { title: 'Try Premium News — Ad Free', imageUrl: 'https://placehold.co/600x200/e94560/fff?text=NewsBite+Premium', targetLink: 'https://example.com/premium', category: 'general', isActive: true },
  { title: 'Top Tech Deals This Week', imageUrl: 'https://placehold.co/600x200/1a1a2e/fff?text=Tech+Deals', targetLink: 'https://example.com/tech-deals', category: 'technology', isActive: true },
  { title: 'Invest Smarter with FinanceApp', imageUrl: 'https://placehold.co/600x200/28a745/fff?text=FinanceApp', targetLink: 'https://example.com/finance', category: 'business', isActive: true },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@newsbite.com' });
  if (!existing) {
    await User.create({ name: 'Admin', email: 'admin@newsbite.com', password: 'admin123', role: 'admin' });
    console.log('Admin user created: admin@newsbite.com / admin123');
  } else {
    console.log('Admin already exists');
  }

  for (const agent of agents) {
    await Agent.findOneAndUpdate({ rssUrl: agent.rssUrl }, agent, { upsert: true, new: true });
  }
  console.log(`${agents.length} agents seeded`);

  for (const ad of ads) {
    await Ad.findOneAndUpdate({ title: ad.title }, ad, { upsert: true, new: true });
  }
  console.log(`${ads.length} ads seeded`);

  await mongoose.disconnect();
  console.log('Done.');
};

seed().catch((err) => { console.error(err); process.exit(1); });
