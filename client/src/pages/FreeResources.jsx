import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FreeResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/freeresources');
                setResources(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching free resources:", err);
                setError('Failed to fetch content from the database.');
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    if (loading) return (
        <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
        </div>
    );

    if (error) return (
        <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg flex justify-center">
            <div className="text-red-500 font-bold">{error}</div>
        </div>
    );

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background dark:bg-darkBg text-gray-900 dark:text-gray-100 flex flex-col items-center transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-accent mb-6">Free Resources</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Explore our powerful Free Resources designed to gently support your personal growth journey.
                    </p>
                </div>

                {resources.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 text-xl font-medium">No free resources found at this time.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((res) => (
                            <div key={res._id} className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-accent dark:hover:border-primary">
                                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden relative">
                                    {res.imageUrl ? (
                                        <img src={res.imageUrl} alt={res.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="z-10 text-4xl">📄</span>
                                    )}
                                    <div className="absolute inset-0 bg-primary dark:bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">FREE</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1 mb-3 text-yellow-400 text-sm">
                                        ★★★★★
                                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-medium">({res.numReviews || 0} Reviews)</span>
                                        <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">{res.enrolledStudents || 0} Downloads</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">{res.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 leading-relaxed">{res.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-bold text-green-500">Free</span>
                                        <Link to={`/free-resource/${res._id}`} className="px-5 py-2.5 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-lg font-medium hover:bg-opacity-80 transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeResources;
