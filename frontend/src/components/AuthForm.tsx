import React, { useState } from 'react';

interface AuthFormProps {
    isLogin: boolean;
    onSubmit: (e: React.FormEvent, data: any) => void;
    error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e, { username, password });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
    );
};

export default AuthForm;