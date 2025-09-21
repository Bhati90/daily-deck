import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [auth, setAuth] = useState<{ token: string | null; username: string | null }>({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
    });

    const setAuthData = (token: string | null, username: string | null) => {
        if (token && username) {
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            setAuth({ token, username });
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setAuth({ token: null, username: null });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setAuth({ token, username });
        }
    }, []);

    return { auth, setAuthData };
};