import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    // Styles are now only for the content specific to this page
    const pageStyles = `
        /* Main Hero Section */
        .home-main {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: left;
        }

        .hero-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 60px;
            width: 100%;
            max-width: 1200px;
        }

        .hero-text {
            max-width: 550px;
        }

        .hero-text h1 {
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
        }

        .hero-text p {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #d1c4e9;
            margin-bottom: 40px;
        }

        /* Streak Button Styling */
        .streak-button {
            background-color: #311b92;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px 35px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .streak-button:hover {
            background-color: #4527a0;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Brain Image and Animation */
        .hero-image svg {
            width: 250px;
            height: auto;
            filter: drop-shadow(0 0 30px rgba(255, 126, 185, 0.4));
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
    `;

    return (
        <>
            <style>{pageStyles}</style>
            <main className="home-main">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Welcome to Daily Deck Quiz!</h1>
                        <p>Sharpen your mind with a new, personalized quiz every single day. Build your knowledge streak and challenge yourself.</p>
                        <button className="streak-button" onClick={() => navigate('/dashboard')}>
                            Start Your Daily Streak!
                        </button>
                    </div>
                    <div className="hero-image">
                        <svg width="250" height="250" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5 7.5C16.5 8.32843 15.8284 9 15 9C14.1716 9 13.5 8.32843 13.5 7.5C13.5 6.67157 14.1716 6 15 6C15.8284 6 16.5 6.67157 16.5 7.5Z" fill="#FF7EB9"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.68629 2 6 4.68629 6 8C6 10.3255 7.3952 12.3486 9.33333 13.3333V18C9.33333 19.4728 10.5272 20.6667 12 20.6667C13.4728 20.6667 14.6667 19.4728 14.6667 18V13.3333C16.6048 12.3486 18 10.3255 18 8C18 4.68629 15.3137 2 12 2ZM7.5 8C7.5 5.51472 9.51472 3.5 12 3.5C14.4853 3.5 16.5 5.51472 16.5 8C16.5 9.76142 15.4284 11.2386 14 11.8333V18C14 18.8284 13.3284 19.5 12.5 19.5H11.5C10.6716 19.5 10 18.8284 10 18V11.8333C8.57157 11.2386 7.5 9.76142 7.5 8Z" fill="#FF7EB9"/>
                            <path d="M9.5 7.5C9.5 8.32843 8.82843 9 8 9C7.17157 9 6.5 8.32843 6.5 7.5C6.5 6.67157 7.17157 6 8 6C8.82843 6 9.5 6.67157 9.5 7.5Z" fill="#FF7EB9"/>
                        </svg>
                    </div>
                </div>
            </main>
        </>
    );
};

export default HomePage;