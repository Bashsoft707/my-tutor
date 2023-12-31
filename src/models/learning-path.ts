const mongoose = require('mongoose');

// Mongoose schema for LearningPath
const learningPathSchema = new mongoose.Schema({
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
});

export default mongoose.model('LearningPath', learningPathSchema);