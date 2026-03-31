const AdAnalytics = require('../models/AdAnalytics');
const Ad = require('../models/Ad');

const getCampaignStats = async (req, res, next) => {
  try {
    const [allAds, analyticsData] = await Promise.all([
      Ad.find().lean(),
      AdAnalytics.aggregate([
        {
          $group: {
            _id: '$adId',
            totalViews: { $sum: { $cond: ['$viewed', 1, 0] } },
            totalClicks: { $sum: { $cond: ['$clicked', 1, 0] } },
          },
        },
      ]),
    ]);

    const analyticsMap = {};
    analyticsData.forEach((row) => {
      analyticsMap[row._id.toString()] = row;
    });

    const stats = allAds.map((ad) => {
      const row = analyticsMap[ad._id.toString()] || { totalViews: 0, totalClicks: 0 };
      const ctr = row.totalViews > 0
        ? Math.round((row.totalClicks / row.totalViews) * 10000) / 100
        : 0;
      return { _id: ad._id, ad, totalViews: row.totalViews, totalClicks: row.totalClicks, ctr };
    });

    stats.sort((a, b) => b.totalViews - a.totalViews);
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCampaignStats };
