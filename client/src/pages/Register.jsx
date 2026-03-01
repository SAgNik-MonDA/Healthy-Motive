import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Captcha Logic (Math Captcha)
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [captchaInput, setCaptchaInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { register, googleLogin, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // Depending on configuration, it could return an code or access_token. The backend will need to fetch the profile info.
            const result = await googleLogin(tokenResponse.access_token);
            if (!result.success) {
                setError(result.message);
            } else {
                navigate('/');
            }
        },
        onError: () => setError('Google Login Failed')
    });

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

        const result = await register(name, middleName, lastName, email, password);
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
                <h1 className="text-4xl font-extrabold text-primary dark:text-accent mb-8 text-center">Create Account</h1>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                placeholder="First"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Middle Name</label>
                            <input
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                placeholder="Middle"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                            placeholder="Last"
                        />
                    </div>
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

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-full font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">or</span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                </div>

                <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    className="w-full mt-6 py-3.5 px-4 border border-gray-300 dark:border-gray-700 rounded-full font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Continue with Google
                </button>

                <div className="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                    Already have an account? <Link to="/login" className="text-primary dark:text-accent font-bold hover:underline transition-colors">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
