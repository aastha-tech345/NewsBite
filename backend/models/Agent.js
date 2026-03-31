const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent name is required'],
      trim: true,
    },
    rssUrl: {
      type: String,
      required: [true, 'RSS URL is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    fetchInterval: {
      type: Number,
      default: 30,
      min: [5, 'Fetch interval must be at least 5 minutes'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastFetchedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

agentSchema.index({ category: 1 });
agentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Agent', agentSchema);
