import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { X } from 'lucide-react';

const ManageUsers = () => {
    const { user, onlineUsers = [] } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                };
                const { data } = await axios.get('/api/users', config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.response && err.response.data.message ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        if (user && (user.isAdmin || user.role === 'admin')) {
            fetchUsers();
        }
    }, [user]);

    const handlePromote = async (id) => {
        setActionLoading(id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`/api/users/promote/${id}`, {}, config);
            setUsers(users.map(u => u._id === id ? { ...u, role: 'admin', isAdmin: true } : u));
            setActionLoading(null);
            setSuccessMsg('User successfully promoted to Admin!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.response && err.response.data.message ? err.response.data.message : err.message);
            setActionLoading(null);
        }
    };

    const handleDemote = async (id) => {
        if (id === user._id) {
            alert("You cannot remove your own admin privileges.");
            return;
        }
        setActionLoading(id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`/api/users/demote/${id}`, {}, config);
            setUsers(users.map(u => u._id === id ? { ...u, role: 'user', isAdmin: false } : u));
            setActionLoading(null);
            setSuccessMsg('User successfully demoted to standard user.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.response && err.response.data.message ? err.response.data.message : err.message);
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl mb-6">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registered Users ({users.length})</h2>
            </div>

            {successMsg && (
                <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 m-4 rounded-xl flex justify-between items-center animate-fade-in-down">
                    <span className="font-bold">{successMsg}</span>
                    <button onClick={() => setSuccessMsg('')} className="hover:text-green-900 dark:hover:text-green-100 transition-colors"><X size={18} /></button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                            <th className="px-8 py-4 font-semibold">Name</th>
                            <th className="px-8 py-4 font-semibold">Status</th>
                            <th className="px-8 py-4 font-semibold">Role</th>
                            <th className="px-8 py-4 font-semibold">Joined At</th>
                            <th className="px-8 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        {u.profilePicture ? (
                                            <img src={u.profilePicture} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                {u.name} {u.lastName}
                                            </span>
                                            <a href={`mailto:${u.email}`} className="text-xs text-primary dark:text-accent hover:underline">{u.email}</a>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${onlineUsers.includes(u._id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {onlineUsers.includes(u._id) ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    {(u.role === 'admin' || u.isAdmin) ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                            User
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-4">
                                    {u._id !== user._id && (
                                        <>
                                            {(u.role === 'user' && !u.isAdmin) && (
                                                <button
                                                    onClick={() => handlePromote(u._id)}
                                                    disabled={actionLoading === u._id}
                                                    className={`px-4 py-2 rounded-full text-sm font-bold text-white transition-colors ${actionLoading === u._id
                                                        ? 'bg-primary/50 cursor-not-allowed'
                                                        : 'bg-primary hover:bg-opacity-90'
                                                        }`}
                                                >
                                                    {actionLoading === u._id ? 'Working...' : 'Make Admin'}
                                                </button>
                                            )}
                                            {(u.role === 'admin' || u.isAdmin) && (
                                                <button
                                                    onClick={() => handleDemote(u._id)}
                                                    disabled={actionLoading === u._id}
                                                    className={`px-4 py-2 rounded-full text-sm font-bold text-white transition-colors ${actionLoading === u._id
                                                        ? 'bg-red-500/50 cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-600'
                                                        }`}
                                                >
                                                    {actionLoading === u._id ? 'Working...' : 'Remove Admin'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {u._id === user._id && (
                                        <span className="text-gray-400 dark:text-gray-500 text-sm font-medium italic">Current User</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
