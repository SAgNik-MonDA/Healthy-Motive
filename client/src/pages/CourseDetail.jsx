import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`/api/courses/${id}`);
                setCourse(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg container mx-auto px-6 transition-colors duration-300">
                <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl max-w-2xl mx-auto" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Top Hero Section */}
                <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
                    <div className="w-full lg:w-3/5">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-yellow-400 text-lg">★★★★★</div>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{course.rating} ({course.numReviews} Ratings)</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">10,240 Students Enrolled</span>
                        </div>

                        <div className="bg-background dark:bg-darkCard border-2 border-accent dark:border-gray-700 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                            <button className="w-full sm:w-auto px-10 py-5 bg-primary dark:bg-accent text-white dark:text-primary text-xl rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                Buy Course for ${course.price}
                            </button>
                            <div className="text-gray-800 dark:text-gray-300 font-medium text-center sm:text-left">
                                <span className="block mb-1">❓ Have questions before buying?</span>
                                <a href="https://wa.me/8389802690" target="_blank" rel="noreferrer" className="text-green-600 dark:text-green-400 underline font-semibold hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center sm:justify-start gap-1">
                                    👉 Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5">
                        <div className="w-full aspect-video lg:aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden flex items-center justify-center shadow-xl border-4 border-white dark:border-darkCard relative group">
                            <div className="absolute inset-0 bg-black bg-opacity-20 hidden group-hover:flex items-center justify-center transition-all duration-300 cursor-pointer">
                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-primary dark:text-accent pl-1 shadow-lg">
                                    ▶
                                </div>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">[ {course.title} Video / Image ]</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">What You'll Learn</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                                {course.benefits && course.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-primary dark:text-accent font-bold">✓</span> {benefit}
                                    </li>
                                ))}
                                {/* Fallbacks if benefits array is empty */}
                                {(!course.benefits || course.benefits.length === 0) && (
                                    <li className="flex items-start gap-3"><span className="text-primary dark:text-accent font-bold">✓</span> Practical insights and assignments.</li>
                                )}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Course Description</h2>
                            <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed text-lg pb-10 border-b border-gray-100 dark:border-gray-800">
                                <p>
                                    In today's fast-paced world, finding a moment of quiet can feel impossible. This course wasn't created to give you more "life hacks" to cram into your day. Instead, it’s a gentle, research-backed guide to subtracting the noise and adding meaningful peace.
                                </p>
                                <p>
                                    Over the span of several weeks, we will explore practical assignments, guided audio meditations, and perspective shifts that have helped thousands of students reclaim their peace of mind.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-background dark:bg-darkCard rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Includes</h3>
                            <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
                                <li className="flex items-center gap-3">🎦 4 Hours of on-demand video</li>
                                <li className="flex items-center gap-3">📄 12 Downloadable worksheets</li>
                                <li className="flex items-center gap-3">🎧 5 Guided audio meditations</li>
                                <li className="flex items-center gap-3">♾️ Full lifetime access</li>
                                <li className="flex items-center gap-3">📱 Access on mobile and PC</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
