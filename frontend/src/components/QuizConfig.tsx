import React, { useState } from 'react';

const CLASSES = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const SUBJECTS = ['Maths', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

interface QuizConfigProps {
    onStartQuiz: (config: any) => void;
}

const QuizConfig: React.FC<QuizConfigProps> = ({ onStartQuiz }) => {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
        class: '',
        subjects: [] as string[],
        difficulty: ''
    });

    const handleSelect = (type: keyof typeof config, value: string) => {
        if (type === 'subjects') {
            const currentSubjects = config.subjects;
            const newSubjects = currentSubjects.includes(value)
                ? currentSubjects.filter(s => s !== value)
                : [...currentSubjects, value];
            setConfig(prev => ({ ...prev, subjects: newSubjects }));
        } else {
            setConfig(prev => ({ ...prev, [type]: value }));
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3>In what class are you?</h3>
                        <div className="option-box-container">
                            {CLASSES.map(c => (
                                <div key={c} className={`option-box ${config.class === c ? 'selected' : ''}`} onClick={() => { handleSelect('class', c); setStep(2); }}>
                                    Class {c}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Which subjects do you want questions on?</h3>
                        <div className="option-box-container">
                            {SUBJECTS.map(s => (
                                <div key={s} className={`option-box ${config.subjects.includes(s) ? 'selected' : ''}`} onClick={() => handleSelect('subjects', s)}>
                                    {s}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep(3)} disabled={config.subjects.length === 0}>Next</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Select difficulty level:</h3>
                        <div className="option-box-container">
                            {DIFFICULTIES.map(d => (
                                <div key={d} className={`option-box ${config.difficulty === d ? 'selected' : ''}`} onClick={() => { handleSelect('difficulty', d); setStep(4); }}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3>Your Quiz Setup:</h3>
                        <p><strong>Class:</strong> {config.class}</p>
                        <p><strong>Subjects:</strong> {config.subjects.join(', ')}</p>
                        <p><strong>Difficulty:</strong> {config.difficulty}</p>
                        <p><small>You can generate the next quiz after 24 hours.</small></p>
                        <button onClick={() => onStartQuiz(config)}>Generate My Daily Quiz!</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return <div className="container">{renderStep()}</div>;
};

export default QuizConfig;