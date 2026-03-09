import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EnrolledCourses = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [ebookEnrollments, setEbookEnrollments] = useState([]);
    const [audioEnrollments, setAudioEnrollments] = useState([]);
    const [freeResourceEnrollments, setFreeResourceEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyItems = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [coursesRes, ebooksRes, audiosRes, freeRes] = await Promise.all([
                    axios.get('/api/courses/my-courses', config),
                    axios.get('/api/ebooks/my-ebooks', config),
                    axios.get('/api/guidedaudios/my-audios', config),
                    axios.get('/api/freeresources/my-resources', config)
                ]);
                setEnrollments(coursesRes.data);
                setEbookEnrollments(ebooksRes.data);
                setAudioEnrollments(audiosRes.data);
                setFreeResourceEnrollments(freeRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchMyItems();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const hasNoItems = enrollments.length === 0 && ebookEnrollments.length === 0 && audioEnrollments.length === 0 && freeResourceEnrollments.length === 0;

    return (
        <div className="pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-4">My Learning</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Tracks what you have purchased and the status of your enrollment.
                    </p>
                </div>

                {hasNoItems ? (
                    <div className="text-center bg-white dark:bg-darkCard p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">You are not enrolled in any courses, e-books, guided audios, or free resources yet.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/courses" className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-opacity-90 shadow-md transition-all">
                                Browse Courses
                            </Link>
                            <Link to="/e-books" className="inline-block px-8 py-4 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-full font-bold hover:bg-opacity-80 shadow-md transition-all">
                                Browse E-Books
                            </Link>
                            <Link to="/guided-audios" className="inline-block px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-opacity-80 shadow-md transition-all">
                                Browse Guided Audios
                            </Link>
                            <Link to="/free-resources" className="inline-block px-8 py-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold hover:bg-opacity-80 shadow-md transition-all">
                                Browse Free Resources
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Courses Section */}
                        {enrollments.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">My Courses</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {enrollments.map((record) => {
                                        const course = record.course;
                                        // Use live course data, or fall back to snapshot if course was deleted
                                        const title = course?.title || record.courseSnapshot?.title || 'Course Deleted';
                                        const imageUrl = course?.imageUrl || record.courseSnapshot?.imageUrl || null;
                                        const courseId = course?._id || null;
                                        const isRemoved = !course || course.isDeleted;
                                        return (
                                            <div key={record._id} className="bg-white dark:bg-darkCard rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-primary dark:hover:border-accent">
                                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                    <span className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${record.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                        {record.status === 'Approved' ? 'Enrolled' : record.status}
                                                    </span>
                                                    {isRemoved && (
                                                        <span className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                            Removed from store
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                        {title}
                                                    </h3>
                                                    {isRemoved && (
                                                        <p className="text-xs text-gray-400 italic mb-2">This course was removed from public listing, but you still have full access.</p>
                                                    )}
                                                    <div className="mt-auto">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            Enrolled on: {new Date(record.createdAt).toLocaleDateString()}
                                                        </p>
                                                        {courseId ? (
                                                            <Link to={`/course/${courseId}`} className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-primary dark:text-accent rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                                                                View Course
                                                            </Link>
                                                        ) : (
                                                            <div className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                                                Course No Longer Available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* E-Books Section */}
                        {ebookEnrollments.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">My E-Books</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {ebookEnrollments.map((record) => {
                                        const ebook = record.ebook;
                                        const ebookTitle = ebook?.title || 'E-Book Unavailable';
                                        const ebookImageUrl = ebook?.imageUrl || null;
                                        const ebookId = ebook?._id || null;
                                        const isRemoved = !ebook || ebook.isDeleted;
                                        return (
                                            <div key={record._id} className="bg-white dark:bg-darkCard rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-accent dark:hover:border-primary">
                                                <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
                                                    {ebookImageUrl ? (
                                                        <img src={ebookImageUrl} alt={ebookTitle} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                            [ PDF Cover ]
                                                        </div>
                                                    )}
                                                    <span className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${record.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                        {record.status === 'Approved' ? 'Available' : record.status}
                                                    </span>
                                                    {isRemoved && (
                                                        <span className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                            Removed from store
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                        {ebookTitle}
                                                    </h3>
                                                    {isRemoved && (
                                                        <p className="text-xs text-gray-400 italic mb-2">This e-book was removed from public listing, but you still have full access.</p>
                                                    )}
                                                    <div className="mt-auto">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            Purchased on: {new Date(record.createdAt).toLocaleDateString()}
                                                        </p>
                                                        {ebookId ? (
                                                            <div className="flex flex-col gap-2">
                                                                <Link to={`/e-book/${ebookId}`} className="block w-full text-center px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                                                                    View Details
                                                                </Link>
                                                                {record.status === 'Approved' ? (
                                                                    <a href={ebook.fileUrl} target="_blank" rel="noreferrer" className="block w-full text-center px-4 py-3 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-xl font-bold hover:bg-opacity-80 transition-colors shadow-sm">
                                                                        Download PDF
                                                                    </a>
                                                                ) : (
                                                                    <button disabled className="block w-full text-center px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-600 rounded-xl font-bold cursor-not-allowed">
                                                                        Pending Approval
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                                                E-Book No Longer Available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Guided Audios Section */}
                        {audioEnrollments.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">My Guided Audios</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {audioEnrollments.map((record) => {
                                        const audio = record.guidedAudio;
                                        const audioTitle = audio?.title || 'Guided Audio Unavailable';
                                        const audioImageUrl = audio?.imageUrl || null;
                                        const audioId = audio?._id || null;
                                        const isRemoved = !audio || audio.isDeleted;
                                        return (
                                            <div key={record._id} className="bg-white dark:bg-darkCard rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-accent dark:hover:border-primary">
                                                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
                                                    {audioImageUrl ? (
                                                        <img src={audioImageUrl} alt={audioTitle} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">🎧</div>
                                                    )}
                                                    <span className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${record.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                        {record.status === 'Approved' ? 'Available' : record.status}
                                                    </span>
                                                    {isRemoved && (
                                                        <span className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                            Removed from store
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{audioTitle}</h3>
                                                    {isRemoved && (
                                                        <p className="text-xs text-gray-400 italic mb-2">This audio was removed from public listing, but you still have full access.</p>
                                                    )}
                                                    <div className="mt-auto">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            Purchased on: {new Date(record.createdAt).toLocaleDateString()}
                                                        </p>
                                                        {audioId ? (
                                                            <Link to={`/guided-audio/${audioId}`} className="block w-full text-center px-4 py-3 bg-accent dark:bg-gray-800 text-primary dark:text-accent rounded-xl font-bold hover:bg-opacity-80 transition-colors shadow-sm">
                                                                View Details
                                                            </Link>
                                                        ) : (
                                                            <div className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                                                Audio No Longer Available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Free Resources Section */}
                        {freeResourceEnrollments.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">My Free Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {freeResourceEnrollments.map((record) => {
                                        const res = record.freeResource;
                                        const resTitle = res?.title || 'Resource Unavailable';
                                        const resImageUrl = res?.imageUrl || null;
                                        const resId = res?._id || null;
                                        const isRemoved = !res || res.isDeleted;
                                        return (
                                            <div key={record._id} className="bg-white dark:bg-darkCard rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-transparent dark:border-gray-800 hover:border-green-400 dark:hover:border-green-500">
                                                <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
                                                    {resImageUrl ? (
                                                        <img src={resImageUrl} alt={resTitle} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
                                                    )}
                                                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                        Downloaded
                                                    </span>
                                                    {isRemoved && (
                                                        <span className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                            Removed from store
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{resTitle}</h3>
                                                    {isRemoved && (
                                                        <p className="text-xs text-gray-400 italic mb-2">This resource was removed from public listing, but you still have access.</p>
                                                    )}
                                                    <div className="mt-auto">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            Downloaded on: {new Date(record.createdAt).toLocaleDateString()}
                                                        </p>
                                                        {resId ? (
                                                            <Link to={`/free-resource/${resId}`} className="block w-full text-center px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors shadow-sm">
                                                                View & Download Again
                                                            </Link>
                                                        ) : (
                                                            <div className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-xl font-bold cursor-not-allowed">
                                                                Resource No Longer Available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;
