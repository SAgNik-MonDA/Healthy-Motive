import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Captcha Logic (Math Captcha)
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [captchaInput, setCaptchaInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const generateCaptcha = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setCaptchaInput('');
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        generateCaptcha();
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        // Validate Captcha
        if (parseInt(captchaInput) !== num1 + num2) {
            setError('Captcha is incorrect. Please try again.');
            generateCaptcha();
            return;
        }

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
            generateCaptcha();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-darkCard rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-800">
                <h1 className="text-4xl font-extrabold text-primary dark:text-accent mb-8 text-center">Welcome Back</h1>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl mb-6">
                        {error}
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
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Captcha Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Security Check: What is {num1} + {num2}?
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                required
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                placeholder="Answer"
                            />
                            <button type="button" onClick={generateCaptcha} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors dark:text-white">
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium">
                        <Link to="/forgot-password" className="text-primary dark:text-accent hover:underline transition-colors">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-full font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                    Don't have an account? <Link to="/register" className="text-primary dark:text-accent font-bold hover:underline transition-colors">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
