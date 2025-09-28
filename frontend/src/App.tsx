import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashBoard';
import { useAuth } from './hooks/useAuth';
// import LibraryPage from './pages/LibraryPage';

const App: React.FC = () => {
    const { auth, setAuthData } = useAuth();

    const handleLogout = () => {
        setAuthData(null, null);
        // Optionally navigate to home page after logout
        // navigate('/'); 
    };

    // Styles for the global layout and the header from your HomePage design
    const globalStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #1a0b3e;
            background-image: radial-gradient(circle at top right, #3a1a6b, #1a0b3e);
            color: #ffffff;
            min-height: 100vh;
        }

        .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: 0 5%;
        }

        /* Header and Navigation Styling */
        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 0;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo a {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
        }
        
        .logo img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
        }

        .app-nav ul {
            list-style: none;
            display: flex;
            gap: 40px;
            align-items: center;
            margin: 0;
        }

        .app-nav a {
            color: #e0e0e0;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.3s ease;
        }

        .app-nav a:hover {
            color: #ffffff;
        }
        
        .logout-button {
            background-color: #311b92;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 8px 16px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .logout-button:hover {
            background-color: #4527a0;
        }
    `;

    return (
        <Router>
            <style>{globalStyles}</style>
            <div className="app-container">
                <header className="app-header">
                    <div className="logo">
                        <img src="/L.png" alt="BeyondScool Logo" />
                        <Link to="/">BeyondScool</Link>
                    </div>
                    <nav className="app-nav">
                        <ul>
                              <li><Link to="/">Home</Link></li>
                              <li><Link to="/library">Library</Link></li>
                              <li><Link to="/games">Play Games</Link></li>
                              <li><Link to="/quizzes">Play Quiz</Link></li>
                            {auth.token ? (
                                <>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                                </>
                            ) : (
                                <li><Link to="/login">Login</Link></li>
                            )}
                        </ul>
                    </nav>
                </header>
                
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={auth.token ? <Navigate to="/dashboard" /> : <LoginPage setAuthData={setAuthData} />} />
                    <Route path="/dashboard" element={auth.token ? <Dashboard /> : <Navigate to="/login" />} />
                    {/* <Route path="/library" element={<LibraryPage/>} /> */}
                
                </Routes>
            </div>
        </Router>
    );
}

export default App;