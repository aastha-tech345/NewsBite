const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const AdAnalytics = require('../models/AdAnalytics');

const createAd = async (req, res, next) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json({ success: true, ad });
  } catch (err) {
    next(err);
  }
};

const getAllAds = async (req, res, next) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ success: true, ads });
  } catch (err) {
    next(err);
  }
};

const updateAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, ad });
  } catch (err) {
    next(err);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, message: 'Ad deleted' });
  } catch (err) {
    next(err);
  }
};

const resolveAd = async (adId, res) => {
  if (!adId) {
    res.status(400).json({ success: false, message: 'adId is required' });
    return null;
  }
  if (!mongoose.Types.ObjectId.isValid(adId)) {
    res.status(400).json({ success: false, message: 'Invalid adId' });
    return null;
  }
  const ad = await Ad.findById(adId).lean();
  if (!ad) {
    res.status(404).json({ success: false, message: 'Ad not found' });
    return null;
  }
  return ad;
};

const trackView = async (req, res, next) => {
  try {
    const ad = await resolveAd(req.body.adId, res);
    if (!ad) return;
    await AdAnalytics.findOneAndUpdate(
      { userId: req.user._id, adId: ad._id },
      { $set: { viewed: true } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'View tracked' });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true, message: 'View already recorded' });
    next(err);
  }
};

const trackClick = async (req, res, next) => {
  try {
    const ad = await resolveAd(req.body.adId, res);
    if (!ad) return;
    await AdAnalytics.findOneAndUpdate(
      { userId: req.user._id, adId: ad._id },
      { $set: { clicked: true, viewed: true } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Click tracked' });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true, message: 'Click already recorded' });
    next(err);
  }
};

const getAdStats = async (req, res, next) => {
  try {
    const stats = await AdAnalytics.aggregate([
      { $match: { adId: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: '$adId',
          totalViews: { $sum: { $cond: ['$viewed', 1, 0] } },
          totalClicks: { $sum: { $cond: ['$clicked', 1, 0] } },
        },
      },
      {
        $addFields: {
          ctr: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              { $multiply: [{ $divide: ['$totalClicks', '$totalViews'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);
    res.json({ success: true, stats: stats[0] || { totalViews: 0, totalClicks: 0, ctr: 0 } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAd, getAllAds, updateAd, deleteAd, trackView, trackClick, getAdStats };
