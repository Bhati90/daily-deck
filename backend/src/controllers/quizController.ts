import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Quiz from '../models/Quiz';
import User from '../models/User';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Helper function to check if the user can take a quiz
const canTakeQuiz = (lastQuizDate: Date | undefined): boolean => {
    if (!lastQuizDate) return true;
    const now = new Date();
    const lastQuiz = new Date(lastQuizDate);
    const diff = now.getTime() - lastQuiz.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours >= 24;
};

export const generateQuiz = async (req: any, res: Response) => {
    const { class: studentClass, subjects, difficulty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!canTakeQuiz(user.lastQuizTakenAt)) {
        return res.status(403).json({ message: 'You can only generate one quiz every 24 hours.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const prompt = `
            Generate 10 multiple-choice questions for a quiz.
            The topic is "${subjects.join(', ')}" for a class ${studentClass} student.
            The difficulty level is ${difficulty}.
            Provide the output in a valid JSON array format. Do NOT use markdown.
            Each object in the array must have these exact keys: "questionText", "options" (an array of 4 strings), and "correctAnswer" (a string that is one of the options).
            Example format:
            [
              {
                "questionText": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswer": "4"
              }
            ]
        `;

        // New, corrected block
const result = await model.generateContent(prompt);
const response = await result.response;
let text = response.text();

// Clean the response to remove Markdown formatting
if (text.startsWith("```json")) {
    text = text.slice(7, -3).trim(); // Remove ```json at the start and ``` at the end
} else if (text.startsWith("```")) {
    text = text.slice(3, -3).trim(); // Remove ``` at the start and ``` at the end
}

const questions = JSON.parse(text); // Now, parse the clean JSON string
        const newQuiz = new Quiz({
            userId: req.user._id,
            class: studentClass,
            subjects,
            difficulty,
            questions
        });
        await newQuiz.save();
        
        // Return questions without correct answers
        const questionsForUser = questions.map((q: any) => ({
            questionText: q.questionText,
            options: q.options
        }));

        res.status(201).json({ quizId: newQuiz._id, questions: questionsForUser });

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        res.status(500).json({ message: 'Failed to generate quiz. The AI might be busy. Please try again.' });
    }
};

export const submitQuiz = async (req: any, res: Response) => {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz || quiz.userId.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if(quiz.score > 0 || quiz.userAnswers.length > 0) {
        return res.status(400).json({ message: 'Quiz has already been submitted.'});
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });

    quiz.userAnswers = answers;
    quiz.score = score;
    await quiz.save();
    
    // Update user streak
    const user = await User.findById(req.user._id);
    if(user) {
        const now = new Date();
        if(user.lastQuizTakenAt) {
            const diff = now.getTime() - new Date(user.lastQuizTakenAt).getTime();
            const daysDiff = diff / (1000 * 3600 * 24);
            if(daysDiff > 2) {
                user.streak = 1; // Reset streak if more than 48 hours passed
            } else {
                user.streak += 1; // Increment streak
            }
        } else {
            user.streak = 1;
        }
        user.lastQuizTakenAt = now;
        await user.save();
    }

    res.json({
        message: 'Quiz submitted successfully!',
        score,
        total: quiz.questions.length,
        results: quiz,
        streak: user?.streak
    });
};

export const getLatestQuiz = async (req: any, res: Response) => {
    const quiz = await Quiz.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if(quiz) {
        res.json(quiz);
    } else {
        res.status(404).json({ message: 'No quiz history found.' });
    }
};