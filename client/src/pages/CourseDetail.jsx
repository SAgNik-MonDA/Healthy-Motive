import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Review State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    // Enroll State
    const [enrolling, setEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState('');
    const [enrollSuccess, setEnrollSuccess] = useState('');

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
    }, [id, reviewSuccess, enrollSuccess]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/courses/${id}/reviews`, { rating, comment }, config);
            setReviewSuccess('Review submitted successfully');
            setRating(0);
            setComment('');
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
        }
    };

    const navigate = useNavigate();

    const enrollHandler = () => {
        if (!user) {
            setEnrollError('Please sign in to buy this course');
            return;
        }
        navigate(`/course/${id}/payment`);
    };

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
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{course.rating || 0} ({course.numReviews || 0} Ratings)</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{(course.enrolledStudents || 0).toLocaleString()} Students Enrolled</span>
                        </div>

                        <div className="bg-background dark:bg-darkCard border-2 border-accent dark:border-gray-700 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                            <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-2">
                                <button
                                    onClick={enrollHandler}
                                    disabled={enrolling}
                                    className="w-full px-10 py-5 bg-primary dark:bg-accent text-white dark:text-primary text-xl rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {enrolling ? 'Enrolling...' : `Buy Course for $${course.price}`}
                                </button>
                                {enrollSuccess && <p className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl text-center w-full">{enrollSuccess}</p>}
                                {enrollError && <p className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl text-center w-full">{enrollError}</p>}
                            </div>
                            <div className="text-gray-800 dark:text-gray-300 font-medium text-center sm:text-left">
                                <span className="block mb-1">❓ Have questions before buying?</span>
                                <a href="https://wa.me/8389802690" target="_blank" rel="noreferrer" className="text-green-600 dark:text-green-400 underline font-semibold hover:text-green-700 dark:hover:text-green-300 flex items-center justify-center sm:justify-start gap-1">
                                    👉 Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5">
                        <div className="w-full aspect-video lg:aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-darkCard relative group">
                            {course.imageUrl ? (
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                                    [ {course.title} Image ]
                                </div>
                            )}
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
                            {course.courseIncludes && course.courseIncludes.length > 0 ? (
                                <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
                                    {course.courseIncludes.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">✧ {item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
                                    <li className="flex items-center gap-3">🎦 4 Hours of on-demand video</li>
                                    <li className="flex items-center gap-3">📄 12 Downloadable worksheets</li>
                                    <li className="flex items-center gap-3">🎧 5 Guided audio meditations</li>
                                    <li className="flex items-center gap-3">♾️ Full lifetime access</li>
                                    <li className="flex items-center gap-3">📱 Access on mobile and PC</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reviews & Feedback</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* List of Reviews */}
                        <div>
                            {course.reviews && course.reviews.length === 0 && <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</div>}
                            <div className="space-y-6">
                                {course.reviews && course.reviews.map((review) => (
                                    <div key={review._id} className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Review Form */}
                        <div>
                            <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>

                                {reviewSuccess && (
                                    <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 font-bold">{reviewSuccess}</div>
                                )}
                                {reviewError && (
                                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-bold">{reviewError}</div>
                                )}

                                {user ? (
                                    <form onSubmit={submitReviewHandler} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                            <select
                                                value={rating}
                                                onChange={(e) => setRating(Number(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="">Select Rating...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                            <textarea
                                                rows="4"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                                placeholder="Share your experience with this course..."
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!rating}
                                            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Submit Feedback
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Please sign in to share your feedback.</p>
                                        <Link to="/auth" className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition">
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
