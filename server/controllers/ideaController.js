// server/controllers/ideaController.js - FINAL COMPLETE VERSION
import Idea from '../models/Idea.js';

// Get all ideas
// Replace the old getIdeas function with this one in server/controllers/ideaController.js

// Replace the old getIdeas function with this one in server/controllers/ideaController.js

// Replace the old getIdeas function with this one in server/controllers/ideaController.js

export const getIdeas = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // --- 1. PAGINATION LOGIC ---
    const limit = 12; // The number of ideas to return per page
    const page = Number(req.query.page) || 1; // The requested page number, default to 1

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Get the total number of documents that match the filter
    const count = await Idea.countDocuments(filter);

    const ideas = await Idea.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      // --- 2. APPLY PAGINATION TO THE QUERY ---
      .limit(limit) // Limit the number of results
      .skip(limit * (page - 1)); // Skip documents for previous pages

    // --- 3. SEND BACK PAGINATION INFO WITH THE RESPONSE ---
    res.json({
      ideas, // The array of ideas for the current page
      page,  // The current page number
      pages: Math.ceil(count / limit) // The total number of pages
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
// Create a new idea
export const createIdea = async (req, res) => {
  try {
    const { title, description, tags, difficulty,category } = req.body;
    const newIdea = new Idea({
      title, description, tags, difficulty,category,
      user: req.user._id,
    });
    const savedIdea = await newIdea.save();
    const populatedIdea = await Idea.findById(savedIdea._id).populate('user', 'name');
    res.status(201).json(populatedIdea);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserIdeas = async (req, res) => {
  try {
    // Find ideas where the user field matches the userId from the route parameters
    const ideas = await Idea.find({ user: req.params.userId })
      .populate('user', 'name') // Still populate the name for consistency
      .sort({ createdAt: -1 });
    
    if (ideas && ideas.length > 0) {
      res.json(ideas);
    } else {
      // It's not an error if a user has no ideas, just return an empty array
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an idea
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await idea.deleteOne();
    res.status(200).json({ message: 'Idea removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Toggle a bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('user', 'name');
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (!idea.bookmarkedBy) idea.bookmarkedBy = [];
    const userId = req.user._id.toString();
    const isBookmarked = idea.bookmarkedBy.some(id => id.toString() === userId);

    if (isBookmarked) {
      idea.bookmarkedBy = idea.bookmarkedBy.filter(id => id.toString() !== userId);
    } else {
      idea.bookmarkedBy.push(req.user._id);
    }
    await idea.save();
    // We send back the full idea object so the frontend can update its state if needed
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user's bookmarked ideas
export const getBookmarkedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ bookmarkedBy: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};