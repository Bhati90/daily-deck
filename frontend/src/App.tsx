import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashBoard';
import { useAuth } from './hooks/useAuth';

function App() {
    const { auth, setAuthData } = useAuth();

    const handleLogout = () => {
        setAuthData(null, null);
    };

    return (
        <Router>
            <nav style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Daily Deck</Link>
                {auth.token ? (
                    <div>
                        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={auth.token ? <Navigate to="/dashboard" /> : <LoginPage setAuthData={setAuthData} />} />
                <Route path="/dashboard" element={auth.token ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;