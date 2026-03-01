import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Simulated backend call logic
            const { data } = await axios.post('/api/users/login', { email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            return { success: false, message };
        }
    };

    const register = async (name, middleName, lastName, email, password) => {
        try {
            const { data } = await axios.post('/api/users/register', { name, middleName, lastName, email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            return { success: false, message };
        }
    };

    const googleLogin = async (tokenId) => {
        try {
            const { data } = await axios.post('/api/users/google', { token: tokenId });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('userInfo');
    };

    const updateProfile = async (profileData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('/api/users/profile', profileData, config);
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
