import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Eye, X } from 'lucide-react';

const ManageEnrollments = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/courses/enrollments/all', config);
                setEnrollments(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [user.token]);

    if (loading) return <div>Loading enrollments...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enrolled Students</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                            <th className="px-8 py-4 font-semibold">Student Name</th>
                            <th className="px-8 py-4 font-semibold">Course Name</th>
                            <th className="px-8 py-4 font-semibold">Enrolled Date</th>
                            <th className="px-8 py-4 font-semibold">Screenshot</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {enrollments.map((record) => (
                            <tr key={record._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <td className="px-8 py-4">
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {record.user?.name} {record.user?.lastName || ''}
                                    </div>
                                    <div className="text-sm text-gray-500">{record.user?.email}</div>
                                </td>
                                <td className="px-8 py-4 text-gray-600 dark:text-gray-300">
                                    {record.course?.title || 'Unknown Course'}
                                </td>
                                <td className="px-8 py-4 text-gray-500 text-sm flex items-center h-full">
                                    <span className="block mt-3">{new Date(record.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="px-8 py-4">
                                    {record.paymentScreenshot ? (
                                        <button
                                            onClick={() => setFullscreenImage(record.paymentScreenshot)}
                                            className="text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full transition-colors flex items-center justify-center gap-2"
                                            title="View Payment Proof"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">No image</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enrollments.length === 0 && <div className="p-8 text-center text-gray-500">No students enrolled yet.</div>}
            </div>

            {/* Custom Fullscreen Image Modal Overlay */}
            {fullscreenImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center">
                        <button
                            onClick={() => setFullscreenImage(null)}
                            className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                        >
                            <X size={28} />
                        </button>
                        <img
                            src={fullscreenImage}
                            alt="Payment Fullscreen"
                            className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEnrollments;
