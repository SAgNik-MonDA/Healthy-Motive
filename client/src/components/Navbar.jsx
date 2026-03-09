import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme based on localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Check if profile is complete
    const isProfileComplete = user && user.address && user.profilePicture && user.occupation && user.hobby;

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'E-Books', path: '/e-books' },
        { name: 'Guided Audios', path: '/guided-audios' },
        { name: 'Free Resources', path: '/free-resources' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed w-full bg-white dark:bg-darkCard bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm top-0 left-0 transition-colors duration-300">
            {/* Banner for incomplete profile */}
            {user && !isProfileComplete && (
                <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-center text-sm py-2 font-medium">
                    Please complete your profile until the full profile is complete. <Link to="/profile" className="underline font-bold ml-2">Complete Now</Link>
                </div>
            )}
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary dark:text-accent tracking-wide">
                    Healthy Motive
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent font-medium transition-colors">
                            {link.name}
                        </Link>
                    ))}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full font-semibold text-primary dark:text-accent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-primary dark:bg-accent text-white dark:text-primary rounded-full overflow-hidden">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </span>
                                <span>{user.name.split(' ')[0]}</span>
                            </button>

                            {/* Dropdown Profile Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 transition-colors">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {user.name} {user.middleName ? user.middleName + ' ' : ''}{user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col py-2">
                                        {user.isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="px-4 py-3 text-sm font-bold text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/my-courses"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            My Learning
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            My Profile {(!isProfileComplete) && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                logout();
                                            }}
                                            className="px-4 py-3 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition-colors shadow-md">
                            Login / My Account
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    {/* Mobile Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-darkCard shadow-xl absolute w-full left-0 top-full transition-colors duration-300">
                    <div className="flex flex-col px-6 py-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={toggleMenu}
                                className="text-gray-700 dark:text-gray-300 text-lg hover:text-primary dark:hover:text-accent font-medium border-b border-gray-100 dark:border-gray-800 pb-2 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={toggleMenu}
                                        className="text-primary dark:text-accent font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2 transition-colors"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link
                                    to="/my-courses"
                                    onClick={toggleMenu}
                                    className="text-gray-700 dark:text-gray-300 text-lg hover:text-primary dark:hover:text-accent font-bold border-b border-gray-100 dark:border-gray-800 pb-2 transition-colors pl-4"
                                >
                                    My Learning
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={toggleMenu}
                                    className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300 text-lg hover:text-primary dark:hover:text-accent font-medium border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors"
                                >
                                    <span className="w-10 h-10 flex items-center justify-center bg-primary dark:bg-accent text-white dark:text-primary rounded-full overflow-hidden flex-shrink-0">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </span>
                                    <span>
                                        My Profile {(!isProfileComplete) && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        toggleMenu();
                                    }}
                                    className="mt-4 px-6 py-3 bg-red-600 text-white text-center rounded-full font-semibold hover:bg-opacity-90 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={toggleMenu}
                                className="mt-4 px-6 py-3 bg-primary text-white text-center rounded-full font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                Login / My Account
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
