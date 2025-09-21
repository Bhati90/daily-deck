import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  class: { type: String, required: true },
  subjects: [{ type: String, required: true }],
  difficulty: { type: String, required: true },
  questions: [questionSchema],
  userAnswers: [{ type: String }],
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;