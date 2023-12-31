import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  learningObjectives: {
    type: [String],
    required: true,
  },
  learningPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath',
  }],
});

export default mongoose.model('Lesson', lessonSchema);