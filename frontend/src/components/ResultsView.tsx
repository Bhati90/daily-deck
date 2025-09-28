import React from 'react';

// Updated to accept optional pointsData
const ResultsView = ({ quizData, pointsData }: { quizData: any, pointsData?: { points: number, bonus: number } | null }) => {
    if (!quizData) return <p>No quiz data available.</p>;

    return (
        <div className="container">
            <h2>Your Last Quiz Result</h2>
            <h3>Score: {quizData.score} / {quizData.questions.length}</h3>

            {/* --- NEW: Display points earned --- */}
            {pointsData && (
                <div style={{ padding: '10px', margin: '15px 0', backgroundColor: '#2e2e2e', borderRadius: '8px' }}>
                    <p>+ {pointsData.points} points for completing the quiz!</p>
                    {pointsData.bonus > 0 && (
                        <p style={{ color: '#F6C41B', fontWeight: 'bold' }}>
                            + {pointsData.bonus} bonus points for your streak! 🔥
                        </p>
                    )}
                    <p>Total Earned: {pointsData.points + pointsData.bonus} points</p>
                </div>
            )}

            <p>You can play again after 24 hours from when you started this quiz.</p>
            <hr />
            <div>
                {quizData.questions.map((q: any, index: number) => (
                    <div key={q._id} style={{ textAlign: 'left', marginBottom: '20px', padding: '10px', border: '1px solid #444', borderRadius: '5px' }}>
                        <p><strong>Q{index + 1}: {q.questionText}</strong></p>
                        <ul>
                            {q.options.map((opt: string) => {
                                let style: React.CSSProperties = {};
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