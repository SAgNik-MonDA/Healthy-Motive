import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const GuidedAudioDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [audio, setAudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Enroll State
    const [enrollError, setEnrollError] = useState('');

    // Review State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const { data } = await axios.get(`/api/guidedaudios/${id}`);
                setAudio(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchAudio();
    }, [id, reviewSuccess]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/guidedaudios/${id}/reviews`, { rating, comment }, config);
            setReviewSuccess('Review submitted successfully');
            setRating(0);
            setComment('');
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
        }
    };

    // Navigate to payment page — same as EBook flow
    const enrollHandler = () => {
        if (!user) {
            setEnrollError('Please sign in to buy this Guided Audio');
            return;
        }
        navigate(`/guided-audio/${id}/payment`);
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    if (error || !audio) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <p className="text-red-500 font-bold text-xl">{error || 'Guided Audio not found.'}</p>
                    <Link to="/guided-audios" className="mt-6 inline-block px-8 py-3 bg-primary text-white rounded-full font-bold">Back to Guided Audios</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row gap-16 mb-20 items-start">
                    <div className="w-full lg:w-3/5">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-6 leading-tight">
                            {audio.title}
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                            {audio.description}
                        </p>

                        <div className="flex items-center gap-4 mb-8 flex-wrap">
                            <div className="text-yellow-400 text-lg">★★★★★</div>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{audio.rating || 0} ({audio.numReviews || 0} Ratings)</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{(audio.enrolledStudents || 0).toLocaleString()} Students Enrolled</span>
                        </div>

                        <div className="bg-background dark:bg-darkCard border-2 border-accent dark:border-gray-700 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                            <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-2">
                                <button
                                    onClick={enrollHandler}
                                    className="w-full px-10 py-5 bg-primary dark:bg-accent text-white dark:text-primary text-xl rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Buy Audio for ${audio.price}
                                </button>
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
                        <div className="w-full aspect-video lg:aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-darkCard">
                            {audio.imageUrl ? (
                                <img src={audio.imageUrl} alt={audio.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">🎧</div>
                            )}
                        </div>
                        {audio.audioUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Preview</p>
                                <audio controls src={audio.audioUrl} className="w-full rounded-xl"></audio>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content + Includes Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Audio</h2>
                            <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed text-lg pb-10 border-b border-gray-100 dark:border-gray-800">
                                <p>
                                    Immerse yourself in a carefully crafted listening experience designed to calm, focus, and inspire. Accessible anytime, anywhere on your device.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-background dark:bg-darkCard rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Audio Includes</h3>
                            <ul className="space-y-4 text-gray-700 dark:text-gray-300 font-medium">
                                {audio.audioIncludes && audio.audioIncludes.length > 0 ? (
                                    audio.audioIncludes.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">{item}</li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-center gap-3">🎧 High quality audio</li>
                                        <li className="flex items-center gap-3">♾️ Full lifetime access</li>
                                        <li className="flex items-center gap-3">📱 Listen on PC, Mobile, or Tablet</li>
                                        <li className="flex items-center gap-3">✨ Instant access after purchase</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reviews & Feedback</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* List of Reviews */}
                        <div>
                            {audio.reviews && audio.reviews.length === 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</div>
                            )}
                            <div className="space-y-6">
                                {audio.reviews && audio.reviews.map((review) => (
                                    <div key={review._id} className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{review.name}</div>
                                            <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Write a Review */}
                        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>
                            {user ? (
                                <form onSubmit={submitReviewHandler} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                        <select value={rating} onChange={(e) => setRating(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                                            <option value="">Select rating</option>
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={4} placeholder="Share your experience..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                                    </div>
                                    {reviewError && <p className="text-red-500 text-sm font-bold">{reviewError}</p>}
                                    {reviewSuccess && <p className="text-green-500 text-sm font-bold">{reviewSuccess}</p>}
                                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition">Submit Review</button>
                                </form>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Please <Link to="/login" className="text-primary dark:text-accent font-bold underline">sign in</Link> to write a review.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GuidedAudioDetail;
