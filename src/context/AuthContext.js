import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

// Create the context
// Think of this as a global store for auth data
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in when app starts
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/api/accounts/login/', {
            email,
            password
        });

        const { tokens, user: userData } = response.data;

        // Save tokens to localStorage
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        return userData;
    };

    const register = async (formData) => {
        const response = await api.post('/api/accounts/register/', formData);
        const { tokens, user: userData } = response.data;

        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await api.post('/api/accounts/logout/', { refresh });
        } catch (err) {
            // Even if logout fails, clear local data
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook — makes using auth context easier
// Instead of: const { user } = useContext(AuthContext)
// Just write: const { user } = useAuth()
export const useAuth = () => useContext(AuthContext);