import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Hide on home and auth pages since there's nowhere logically to go back to normally in the main flow
        const hiddenPaths = ['/', '/login', '/register', '/forgot-password'];
        if (hiddenPaths.includes(pathname)) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed top-24 left-4 z-40 bg-white dark:bg-darkCard w-12 h-12 md:w-14 md:h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-primary dark:text-accent hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 md:top-28 md:left-8"
            aria-label="Go Back"
            title="Go Back"
        >
            <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
    );
};

export default BackButton;
