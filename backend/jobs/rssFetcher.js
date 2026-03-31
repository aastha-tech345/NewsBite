const cron = require('node-cron');
const Parser = require('rss-parser');
const Agent = require('../models/Agent');
const Article = require('../models/Article');

const parser = new Parser({
  customFields: { item: ['media:content', 'enclosure'] },
});

const fetchAndStore = async (agent) => {
  try {
    const feed = await parser.parseURL(agent.rssUrl);

    const docs = feed.items.map((item) => ({
      title: item.title || 'Untitled',
      description: item.contentSnippet || item.summary || '',
      link: item.link,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      category: agent.category,
      source: feed.title || agent.name,
      imageUrl: item['media:content']?.$.url || item.enclosure?.url || null,
    }));

    const result = await Article.insertMany(docs, { ordered: false }).catch((err) => {
      if (err.code === 11000) return { insertedCount: err.result?.nInserted || 0 };
      throw err;
    });

    await Agent.findByIdAndUpdate(agent._id, { lastFetchedAt: new Date() });
    console.log(`[RSS] ${agent.name}: stored ${result?.insertedCount ?? docs.length} new articles`);
  } catch (err) {
    console.error(`[RSS] Failed to fetch "${agent.name}": ${err.message}`);
  }
};

const runFetchCycle = async () => {
  console.log('[RSS] Running fetch cycle...');
  try {
    const agents = await Agent.find({ isActive: true });
    const now = Date.now();

    for (const agent of agents) {
      const intervalMs = (agent.fetchInterval || 10) * 60 * 1000;
      const lastFetch = agent.lastFetchedAt ? new Date(agent.lastFetchedAt).getTime() : 0;

      if (now - lastFetch >= intervalMs) {
        fetchAndStore(agent);
      }
    }
  } catch (err) {
    console.error('[RSS] Scheduler cycle error:', err.message);
  }
};

setTimeout(runFetchCycle, 3000);
cron.schedule('*/10 * * * *', runFetchCycle);

console.log('[RSS] Scheduler started — first fetch in 3s, then every 10 minutes');
