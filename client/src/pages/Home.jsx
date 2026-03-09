import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);

    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            try {
                const { data } = await axios.get('/api/courses');
                setFeaturedCourses(data.slice(0, 3)); // Display top 3 courses
            } catch (err) {
                console.error("Failed to fetch featured courses:", err);
            }
        };

        fetchFeaturedCourses();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col pt-16">

            {/* 1. Hero Section */}
            <section className="relative w-full bg-background dark:bg-darkBg px-6 py-20 lg:py-32 flex flex-col md:flex-row items-center justify-between container mx-auto transition-colors duration-300">
                <div className="md:w-1/2 flex flex-col items-start text-left mb-12 md:mb-0 z-10">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-primary dark:text-accent leading-tight mb-6">
                        Learn. Heal. Grow. <span className="text-gray-900 dark:text-white block">Globally.</span>
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                        Discover resources, courses, and guidance designed to bring lasting peace and practical motivation into your everyday life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/courses" className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            Explore Courses
                        </Link>
                        <Link to="/e-books" className="px-8 py-4 bg-accent text-primary dark:bg-primary dark:text-white rounded-full font-semibold shadow hover:bg-opacity-80 transition-all duration-300">
                            Free Resources
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 w-full flex justify-center lg:justify-end relative">
                    <div className="absolute inset-0 bg-accent dark:bg-primary opacity-30 rounded-full blur-3xl transform scale-150"></div>
                    <div className="w-full max-w-md aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 font-medium">[ Image Placeholder: Book Pages ]</span>
                    </div>
                </div>
            </section>

            {/* 2. What You Offer */}
            <section className="w-full py-20 bg-white dark:bg-darkCard transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-primary dark:text-accent mb-16">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Offer Card 1 */}
                        <div className="group bg-background dark:bg-darkBg rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-accent dark:hover:border-primary">
                            <div className="w-16 h-16 bg-accent dark:bg-primary rounded-full flex items-center justify-center mb-6 text-primary dark:text-white text-2xl">📚</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">E-Books</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Access our collection of comprehensive e-books designed to inspire and guide you through personal growth.</p>
                            <Link to="/e-books" className="text-primary dark:text-accent font-semibold group-hover:underline flex items-center gap-2">
                                View More <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                        {/* Offer Card 2 */}
                        <div className="group bg-background dark:bg-darkBg rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-accent dark:hover:border-primary">
                            <div className="w-16 h-16 bg-accent dark:bg-primary rounded-full flex items-center justify-center mb-6 text-primary dark:text-white text-2xl">🎓</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Online Courses</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Step-by-step video lessons and community support to help you achieve your goals effectively.</p>
                            <Link to="/courses" className="text-primary dark:text-accent font-semibold group-hover:underline flex items-center gap-2">
                                View More <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                        {/* Offer Card 3 */}
                        <div className="group bg-background dark:bg-darkBg rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-accent dark:hover:border-primary">
                            <div className="w-16 h-16 bg-accent dark:bg-primary rounded-full flex items-center justify-center mb-6 text-primary dark:text-white text-2xl">🎧</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Guided Audios</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Relaxing and motivational audio sessions perfect for your daily commute or morning routine.</p>
                            <Link to="/guided-audios" className="text-primary dark:text-accent font-semibold group-hover:underline flex items-center gap-2">
                                View More <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Trust Section */}
            <section className="w-full py-20 bg-primary dark:bg-gray-900 text-white transition-colors duration-300">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Trusted by a Global Audience</h2>
                    <p className="text-xl md:text-2xl font-light text-accent dark:text-gray-300 mb-12 leading-relaxed">
                        Years of proven research translated into simple, accessible language. Join thousands of users worldwide who have transformed their mindset, built healthy habits, and found a clear path to mental clarity.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 text-center">
                        <div>
                            <p className="text-4xl font-extrabold mb-2 text-white dark:text-accent">10k+</p>
                            <p className="text-sm uppercase tracking-wider opacity-80">Students</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold mb-2 text-white dark:text-accent">50+</p>
                            <p className="text-sm uppercase tracking-wider opacity-80">Courses</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold mb-2 text-white dark:text-accent">4.9/5</p>
                            <p className="text-sm uppercase tracking-wider opacity-80">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Featured Products */}
            <section className="w-full py-24 bg-background dark:bg-darkBg transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-4xl font-bold text-primary dark:text-accent">Featured Courses</h2>
                        <Link to="/courses" className="text-primary dark:text-accent font-medium hover:underline hidden sm:block">View all courses →</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCourses.length > 0 ? featuredCourses.map((course) => (
                            <div key={course._id} className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100 dark:border-gray-800">
                                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden">
                                    {course.imageUrl ? (
                                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>[ Image Placeholder ]</span>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1 mb-3 text-yellow-400 text-sm">
                                        ★★★★★ <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">({course.numReviews || 0})</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-bold text-primary dark:text-accent">${course.price}</span>
                                        <Link to={`/course/${course._id}`} className="px-4 py-2 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-lg font-medium hover:bg-opacity-80 transition-colors">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-10 text-center text-gray-500 font-medium">No top courses available at this time.</div>
                        )}
                    </div>
                    <div className="mt-10 text-center sm:hidden">
                        <Link to="/courses" className="text-primary dark:text-accent font-medium hover:underline">View all courses →</Link>
                    </div>
                </div>
            </section>

            {/* 5. About You */}
            <section className="w-full py-24 bg-white dark:bg-darkCard relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-accent dark:bg-primary opacity-20 -skew-y-3 transform origin-top-left"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-8 flex items-center justify-center shadow-lg border-4 border-white dark:border-darkCard">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">[ Avatar ]</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 max-w-3xl leading-tight">
                        "Healthy Motive was created to make motivation practical, peaceful, and life-changing — not noisy."
                    </h2>
                    <Link to="/about" className="px-8 py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-full font-semibold shadow hover:bg-opacity-90 hover:scale-105 transition-transform duration-300">
                        Read My Story
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
