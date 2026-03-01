import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        // Here we just simulate an API call response
        setMessage("If an account with that email exists, we have sent a password reset link.");
    };

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-darkCard rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-800">
                <h1 className="text-3xl font-extrabold text-primary dark:text-accent mb-4 text-center">Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>

                {message && (
                    <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-xl mb-6 text-sm font-medium">
                        {message}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-full font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                    Remembered it? <Link to="/login" className="text-primary dark:text-accent font-bold hover:underline transition-colors">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
