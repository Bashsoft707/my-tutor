import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  knowledgeLevel: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  interests: {
    type: [String]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  learningPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
  }],
});

export default mongoose.model('Profile', profileSchema);