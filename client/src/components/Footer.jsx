import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <div className="text-2xl font-black text-accent dark:text-primary tracking-wide uppercase">
                        Healthy Motive
                    </div>
                    <p className="text-gray-400 text-center md:text-left text-sm max-w-sm">
                        Making motivation practical, peaceful, and life-changing.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-xs hover:bg-primary dark:hover:bg-accent dark:hover:text-gray-900 transition-colors cursor-pointer">FB</div>
                        <div className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-xs hover:bg-primary dark:hover:bg-accent dark:hover:text-gray-900 transition-colors cursor-pointer">IG</div>
                    </div>
                </div>
                <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Healthy Motive. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-accent dark:hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-accent dark:hover:text-primary transition-colors">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
