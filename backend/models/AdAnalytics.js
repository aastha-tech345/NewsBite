const mongoose = require('mongoose');

const adAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    clicked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

adAnalyticsSchema.index({ userId: 1, adId: 1 }, { unique: true });
adAnalyticsSchema.index({ adId: 1 });

module.exports = mongoose.model('AdAnalytics', adAnalyticsSchema);
