// server/controllers/ideaController.js
import Idea from '../models/Idea.js';

// @desc    Get all ideas (with pagination, category, and search filters)
// @route   GET /api/ideas
export const getIdeas = async (req, res) => {
  try {
    const { category, search } = req.query;

    const limit = 12; // Ideas per page
    const page = Number(req.query.page) || 1;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Idea.countDocuments(filter);

    const ideas = await Idea.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      ideas,
      page,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('ERROR in getIdeas:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new idea
// @route   POST /api/ideas
export const createIdea = async (req, res) => {
  try {
    const { title, description, tags, difficulty, category } = req.body;
    const newIdea = new Idea({
      title,
      description,
      tags,
      difficulty,
      category,
      user: req.user._id,
    });

    const savedIdea = await newIdea.save();
    const populatedIdea = await Idea.findById(savedIdea._id).populate('user', 'name');
    res.status(201).json(populatedIdea);
  } catch (error) {
    console.error('ERROR in createIdea:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all ideas submitted by a specific user (public profile)
// @route   GET /api/ideas/user/:userId
export const getUserIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.params.userId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(ideas || []);
  } catch (error) {
    console.error('ERROR in getUserIdeas:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get ideas created by the logged-in user (My Ideas page)
// @route   GET /api/ideas/myideas
export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    console.error('ERROR in getMyIdeas:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
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
    console.error('ERROR in deleteIdea:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle bookmark for an idea
// @route   PUT /api/ideas/:id/bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('user', 'name');
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const userId = req.user._id.toString();
    const isBookmarked = idea.bookmarkedBy.some(id => id.toString() === userId);

    if (isBookmarked) {
      idea.bookmarkedBy = idea.bookmarkedBy.filter(id => id.toString() !== userId);
    } else {
      idea.bookmarkedBy.push(req.user._id);
    }

    await idea.save();
    res.json(idea);
  } catch (error) {
    console.error('ERROR in toggleBookmark:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all ideas bookmarked by the logged-in user
// @route   GET /api/ideas/mybookmarks
export const getBookmarkedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ bookmarkedBy: req.user._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    console.error('ERROR in getBookmarkedIdeas:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
