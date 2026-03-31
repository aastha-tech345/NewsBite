const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Ad title is required'], trim: true },
    imageUrl: { type: String, required: [true, 'Ad image URL is required'] },
    targetLink: { type: String, required: [true, 'Target link is required'] },
    category: { type: String, lowercase: true, trim: true, default: 'general' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Ad', adSchema);
