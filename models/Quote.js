import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Quote text is required'],
      minlength: [5, 'Quote must be at least 5 characters'],
      maxlength: [500, 'Quote too long'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      minlength: [2, 'Author name required'],
      maxlength: [100],
      trim: true,
    },
    tag: {
      type: String,
      enum: ['Motivation', 'Life', 'Inspiration', 'Success', ''],
      default: '',
    },
    likes: {
      type: Number,
      default: 0,
    },
    // Array of user IDs who have liked this quote
    likedBy: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    // User ID of the creator
    createdBy: {
      type: String,
      default: null,
    },
    createdByName: {
      type: String,
      default: 'Anonymous',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model re-compilation in Next.js hot reload
export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
