import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const ManageFreeResources = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', fileUrl: '' });

    const fetchResources = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/freeresources');
            setResources(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const uploadFileHandler = async (e, field) => {
        const file = e.target.files[0];
        const uploadForm = new FormData();
        uploadForm.append('file', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', uploadForm, config);
            setFormData(prev => ({ ...prev, [field]: `http://localhost:5000${data.file}` }));
            setUploading(false);
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('File upload failed!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (isEditing) {
                await axios.put(`/api/freeresources/${currentId}`, formData, config);
            } else {
                await axios.post('/api/freeresources', formData, config);
            }
            setShowModal(false);
            fetchResources();
            setSuccessMsg(`Resource successfully ${isEditing ? 'updated' : 'created'}!`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = (resource) => {
        setIsEditing(true);
        setCurrentId(resource._id);
        setFormData({ title: resource.title, description: resource.description, imageUrl: resource.imageUrl, fileUrl: resource.fileUrl });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this Free Resource?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/freeresources/${id}`, config);
                fetchResources();
                setSuccessMsg('Resource successfully deleted!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({ title: '', description: '', imageUrl: '', fileUrl: '' });
        setShowModal(true);
    };

    if (loading) return <div>Loading Resources...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Free Resources</h2>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    <Plus size={20} /> Add New
                </button>
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
                            <th className="px-8 py-4 font-semibold">Title</th>
                            <th className="px-8 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {resources.map((res) => (
                            <tr key={res._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <td className="px-8 py-4 font-semibold text-gray-900 dark:text-white">{res.title}</td>
                                <td className="px-8 py-4">
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEdit(res)} className="text-blue-500 bg-blue-50 p-2 rounded-full"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(res._id)} className="text-red-500 bg-red-50 p-2 rounded-full"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-darkCard w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-6">
                        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Resource' : 'Create Resource'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Title" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
                            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800"></textarea>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL or Upload</label>
                                <div className="flex flex-col gap-2">
                                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
                                    <input type="file" onChange={(e) => uploadFileHandler(e, 'imageUrl')} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">File URL or Upload</label>
                                <div className="flex flex-col gap-2">
                                    <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="File URL (PDF, docx)" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
                                    <input type="file" onChange={(e) => uploadFileHandler(e, 'fileUrl')} accept=".pdf,.doc,.docx" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition" />
                                </div>
                                {uploading && <p className="text-xs font-bold text-primary mt-1">Uploading file...</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageFreeResources;
