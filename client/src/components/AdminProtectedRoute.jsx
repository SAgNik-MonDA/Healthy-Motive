import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // Show loading spinner while checking auth status
    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    // Redirect to login if not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to home if user is not an admin
    if (user.role !== 'admin' && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
