import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to Daily Deck Quiz! 🧠</h1>
            <p>Sharpen your mind with a new, personalized quiz every single day. Build your knowledge streak and challenge yourself.</p>
            <button onClick={() => navigate('/dashboard')}>Start Your Daily Streak!</button>
        </div>
    );
};

export default HomePage;