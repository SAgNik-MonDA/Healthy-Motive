import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('/api/courses');
                setCourses(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background dark:bg-darkBg text-gray-900 dark:text-gray-100 flex flex-col items-center transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-accent mb-6">Our Courses</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Explore our carefully crafted courses designed to guide you through personal transformation. Learn at your own pace.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div key={course._id} className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-accent dark:hover:border-primary">
                                {/* Image Placeholder */}
                                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden relative">
                                    <span className="z-10">[ Image: {course.title} ]</span>
                                    <div className="absolute inset-0 bg-primary dark:bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1 mb-3 text-yellow-400 text-sm">
                                        ★★★★★ <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">({course.numReviews})</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">{course.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 leading-relaxed">{course.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-bold text-primary dark:text-accent">${course.price}</span>
                                        <Link to={`/course/${course._id}`} className="px-5 py-2.5 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-lg font-medium hover:bg-opacity-80 transition-colors">
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

export default Courses;
