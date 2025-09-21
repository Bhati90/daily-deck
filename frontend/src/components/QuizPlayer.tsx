import React, { useState } from 'react';

interface Question {
    questionText: string;
    options: string[];
}

interface QuizPlayerProps {
    questions: Question[];
    onSubmit: (answers: string[]) => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, onSubmit }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleNext = () => {
        if (selectedOption) {
            const newAnswers = [...answers, selectedOption];
            setAnswers(newAnswers);
            setSelectedOption(null);
            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
            } else {
                onSubmit(newAnswers);
            }
        }
    };

    return (
        <div className="container">
            <h3>Question {currentQ + 1} of {questions.length}</h3>
            <h4>{questions[currentQ].questionText}</h4>
            <div className="option-box-container" style={{flexDirection: 'column', alignItems: 'stretch'}}>
                {questions[currentQ].options.map((opt, i) => (
                    <div key={i} className={`option-box ${selectedOption === opt ? 'selected' : ''}`} onClick={() => setSelectedOption(opt)}>
                        {opt}
                    </div>
                ))}
            </div>
            <button onClick={handleNext} disabled={!selectedOption}>
                {currentQ < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
            </button>
        </div>
    );
};

export default QuizPlayer;