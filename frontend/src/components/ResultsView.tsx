import React from 'react';

const ResultsView = ({ quizData }: { quizData: any }) => {
    if (!quizData) return <p>No quiz data available.</p>;

    return (
        <div className="container">
            <h2>Your Last Quiz Result</h2>
            <h3>Score: {quizData.score} / {quizData.questions.length}</h3>
            <p>You can play again after 24 hours from when you started this quiz.</p>
            <hr />
            <div>
                {quizData.questions.map((q: any, index: number) => (
                    <div key={q._id} style={{ textAlign: 'left', marginBottom: '20px', padding: '10px', border: '1px solid #444', borderRadius: '5px' }}>
                        <p><strong>Q{index + 1}: {q.questionText}</strong></p>
                        <ul>
                            {q.options.map((opt: string) => {
                                let style = {};
                                if (opt === q.correctAnswer) {
                                    style = { color: 'lightgreen', fontWeight: 'bold' };
                                }
                                if (opt === quizData.userAnswers[index] && opt !== q.correctAnswer) {
                                    style = { color: 'salmon', textDecoration: 'line-through' };
                                }
                                return <li key={opt} style={style}>{opt}</li>;
                            })}
                        </ul>
                        <p>Your Answer: {quizData.userAnswers[index] || 'Not answered'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsView;