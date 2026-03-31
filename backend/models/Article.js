const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      required: [true, 'Article link is required'],
      unique: true,
      trim: true,
    },
    pubDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

articleSchema.index({ link: 1 }, { unique: true });
articleSchema.index({ category: 1, pubDate: -1 });
articleSchema.index({ pubDate: -1 });

module.exports = mongoose.model('Article', articleSchema);
