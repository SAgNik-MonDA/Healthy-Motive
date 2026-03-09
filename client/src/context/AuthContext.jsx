import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

// Connect to the backend
const socket = io('http://localhost:5000', { autoConnect: false });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);

        // Socket setup
        socket.connect();
        socket.on('online_users', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('online_users');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (user && user._id) {
            socket.emit('register_user', user._id);
        }
    }, [user]);

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
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateProfile, loading, onlineUsers }}>
            {children}
        </AuthContext.Provider>
    );
};
