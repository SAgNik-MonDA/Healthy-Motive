import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Eye, X } from 'lucide-react';

const ManageFreeResourceEnrollments = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/freeresources/enrollments/all', config);
                setEnrollments(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, [user.token]);

    if (loading) return <div>Loading free resource downloads...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Free Resource Downloads</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                            <th className="px-8 py-4 font-semibold">Student Name</th>
                            <th className="px-8 py-4 font-semibold">Resource</th>
                            <th className="px-8 py-4 font-semibold">Downloaded On</th>
                            <th className="px-8 py-4 font-semibold">Status</th>
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
                                    {record.freeResource?.title || 'Unknown Resource'}
                                </td>
                                <td className="px-8 py-4 text-gray-500 text-sm">
                                    {new Date(record.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-4">
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                                        Downloaded
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enrollments.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No downloads recorded yet.</div>
                )}
            </div>
        </div>
    );
};

export default ManageFreeResourceEnrollments;
