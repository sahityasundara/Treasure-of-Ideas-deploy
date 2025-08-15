// server/models/Idea.js
import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  tags: {
    type: [String],
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  upvotes: {
    type: Number,
    default: 0,
  },
user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // <-- The source of the error
    ref: 'User',
},
  category: {
    type: String,
    required: true,
    enum: ['Software', 'Hardware', 'Both'], // Restricts values to these three
    default: 'Software', // A sensible default
  },
  // --- THIS IS THE FIX ---
  // We ensure bookmarkedBy is always an array, even for old documents.
  bookmarkedBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [], // If the field is missing, default to an empty array
  },
}, {
  timestamps: true,
});

const Idea = mongoose.model('Idea', ideaSchema);
export default Idea;