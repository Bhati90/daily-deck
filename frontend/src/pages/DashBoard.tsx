import  { useState, useEffect } from 'react';
import { getProfile, generateQuiz as apiGenerateQuiz, submitQuiz as apiSubmitQuiz, getLatestQuiz } from '../api';
import QuizConfig from '../components/QuizConfig';
import QuizPlayer from '../components/QuizPlayer';
import ResultsView from '../components/ResultsView';

type QuizStatus = 'idle' | 'configuring' | 'generating' | 'playing' | 'submitting' | 'results' | 'waiting';

// --- NEW: Points Calculation Logic ---
const calculatePoints = (streak: number): { points: number, bonus: number } => {
    let points = 10; // Base points for completing a quiz
    let bonus = 0;

    // Milestone bonuses (cumulative)
    if (streak > 0 && streak % 30 === 0) { // Monthly milestone
        bonus += 200;
    } else if (streak > 0 && streak % 7 === 0) { // Weekly milestone
        bonus += 50;
    }
    
    return { points, bonus };
};

const Dashboard = () => {
    const [status, setStatus] = useState<QuizStatus>('idle');
    const [profile, setProfile] = useState<any>(null);
    const [quiz, setQuiz] = useState<any>(null);
    const [quizResult, setQuizResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [pointsEarned, setPointsEarned] = useState<{ points: number, bonus: number } | null>(null);

    const canTakeQuiz = (lastQuizDate: string | undefined): boolean => {
        if (!lastQuizDate) return true;
        const diff = new Date().getTime() - new Date(lastQuizDate).getTime();
        return diff / (1000 * 60 * 60) >= 24;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: profileData } = await getProfile();
                setProfile(profileData);
                if (canTakeQuiz(profileData.lastQuizTakenAt)) {
                    setStatus('configuring');
                } else {
                    const { data: latestQuizData } = await getLatestQuiz();
                    setQuizResult(latestQuizData);
                    setStatus('waiting');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load user data.');
            }
        };
        fetchUserData();
    }, []);

    const handleStartQuiz = async (config: any) => {
        setStatus('generating');
        setError(null);
        try {
            const { data } = await apiGenerateQuiz(config);
            setQuiz(data);
            setStatus('playing');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate quiz.');
            setStatus('configuring');
        }
    };

    const handleSubmitQuiz = async (answers: string[]) => {
        setStatus('submitting');
        try {
            const { data } = await apiSubmitQuiz({ quizId: quiz.quizId, answers });
            setQuizResult(data.results);
            
            // --- NEW: Calculate and set points after successful submission ---
            const newStreak = data.streak;
            const pointsData = calculatePoints(newStreak);
            setPointsEarned(pointsData);

            // Update profile with new streak and points
            setProfile((prev: any) => ({
                ...prev, 
                streak: newStreak,
                points: (prev.points || 0) + pointsData.points + pointsData.bonus
            }));

            setStatus('results');
        } catch (err) {
            setError('Failed to submit quiz.');
            setStatus('playing');
        }
    };
    
    const renderContent = () => {
        switch (status) {
            case 'configuring':
                return <QuizConfig onStartQuiz={handleStartQuiz} />;
            case 'generating':
                return <p>Generating your quiz... 🤖</p>;
            case 'playing':
                return quiz ? <QuizPlayer questions={quiz.questions} onSubmit={handleSubmitQuiz} /> : <p>Loading questions...</p>;
            case 'submitting':
                return <p>Submitting your answers...</p>;
            case 'results':
                // Pass points data to the results view
                return <ResultsView quizData={quizResult} pointsData={pointsEarned} />;
            case 'waiting':
                return <ResultsView quizData={quizResult} />;
             case 'idle':
             default:
                return <p>Loading your dashboard...</p>;
        }
    };

    return (
        <div>
            {profile && (
                <h2>
                    Welcome, {profile.username}! | 🔥 Streak: {profile.streak} | 💰 Points: {profile.points || 0}
                </h2>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {renderContent()}
        </div>
    );
};

export default Dashboard;