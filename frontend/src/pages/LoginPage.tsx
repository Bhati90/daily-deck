import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login, register } from '../api';

interface LoginPageProps {
    setAuthData: (token: string, username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAuthData }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent, formData: any) => {
        e.preventDefault();
        setError(null);
        try {
            const apiCall = isLogin ? login : register;
            const { data } = await apiCall(formData);
            setAuthData(data.token, data.username);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div>
            <AuthForm isLogin={isLogin} onSubmit={handleSubmit} error={error} />
            <button style={{marginTop: '15px', background: 'none', border: 'none', color: '#6495ed', cursor: 'pointer'}} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </button>
        </div>
    );
};

export default LoginPage;