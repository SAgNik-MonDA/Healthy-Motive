import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const ICONS = ['📄', '♾️', '📱', '✨', '🌟', '📌', '💡', '🎓', '🖥️', '🔖'];
const PLACEHOLDERS = [
    'Downloadable PDF',
    'Full lifetime access',
    'Read on PC, Mobile, or Tablet',
    'Instant access after purchase',
    'High quality content',
];

const parseInclude = (str, index) => {
    const defaultIcon = ICONS[index % ICONS.length];
    if (!str) return { icon: defaultIcon, text: '' };

    const firstChar = str.trim().codePointAt(0);
    if (firstChar && firstChar > 255) {
        const spaceIdx = str.trim().indexOf(' ');
        if (spaceIdx !== -1 && spaceIdx <= 7) {
            return {
                icon: str.trim().substring(0, spaceIdx),
                text: str.trim().substring(spaceIdx + 1).trim()
            };
        } else if (spaceIdx === -1 && str.trim().length <= 3) {
            return { icon: str.trim(), text: '' };
        }
    }
    return { icon: defaultIcon, text: str };
};

const ManageEbooks = () => {
    const { user } = useContext(AuthContext);
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', price: 0, imageUrl: '', fileUrl: '',
        formatIncludes: ['', '', '', '', '']
    });

    const fetchEbooks = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/ebooks');
            setEbooks(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEbooks();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFormatIncludeChange = (index, value) => {
        const newIncludes = [...formData.formatIncludes];
        const parsed = parseInclude(newIncludes[index], index);
        newIncludes[index] = `${parsed.icon} ${value}`;
        setFormData({ ...formData, formatIncludes: newIncludes });
    };

    const addFormatInclude = () => {
        setFormData({ ...formData, formatIncludes: [...formData.formatIncludes, ''] });
    };

    const removeFormatInclude = (index) => {
        const newIncludes = formData.formatIncludes.filter((_, i) => i !== index);
        setFormData({ ...formData, formatIncludes: newIncludes });
    };

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
            const payload = {
                ...formData,
                formatIncludes: formData.formatIncludes.filter((inc, idx) => parseInclude(inc, idx).text.trim() !== '')
            };
            if (isEditing) {
                await axios.put(`/api/ebooks/${currentId}`, payload, config);
            } else {
                await axios.post('/api/ebooks', payload, config);
            }
            setShowModal(false);
            fetchEbooks();
            setSuccessMsg(`E-Book successfully ${isEditing ? 'updated' : 'created'}!`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = (ebook) => {
        setIsEditing(true);
        setCurrentId(ebook._id);
        setFormData({
            title: ebook.title,
            description: ebook.description,
            price: ebook.price,
            imageUrl: ebook.imageUrl || '',
            fileUrl: ebook.fileUrl || '',
            formatIncludes: Array.isArray(ebook.formatIncludes) && ebook.formatIncludes.length > 0
                ? ebook.formatIncludes
                : ['']
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this E-Book?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/ebooks/${id}`, config);
                fetchEbooks();
                setSuccessMsg('E-Book successfully deleted!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            title: '', description: '', price: 0, imageUrl: '', fileUrl: '',
            formatIncludes: ['📄', '♾️', '📱', '✨']
        });
        setShowModal(true);
    };

    if (loading) return <div>Loading E-Books...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage E-Books</h2>
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
                            <th className="px-8 py-4 font-semibold">Price</th>
                            <th className="px-8 py-4 font-semibold">Created</th>
                            <th className="px-8 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {ebooks.map((ebook) => (
                            <tr key={ebook._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden">
                                            {ebook.imageUrl ? <img src={ebook.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">PDF</div>}
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">{ebook.title}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-gray-600 dark:text-gray-300">${ebook.price}</td>
                                <td className="px-8 py-4 text-gray-500 text-sm">{new Date(ebook.createdAt).toLocaleDateString()}</td>
                                <td className="px-8 py-4">
                                    <div className="flex gap-3">
                                        <button onClick={() => handleEdit(ebook)} className="text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full transition-colors"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(ebook._id)} className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 p-2 rounded-full transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ebooks.length === 0 && <div className="p-8 text-center text-gray-500">No e-books found. Create one above!</div>}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-darkCard w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit E-Book' : 'Create E-Book'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL or Upload</label>
                                    <div className="flex flex-col gap-2">
                                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="/images/my-ebook.jpg" />
                                        <input type="file" onChange={(e) => uploadFileHandler(e, 'imageUrl')} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition" />
                                    </div>
                                    {uploading && <p className="text-xs font-bold text-primary mt-1">Uploading file...</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">PDF File URL or Upload</label>
                                    <div className="flex flex-col gap-2">
                                        <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="/files/my-ebook.pdf" />
                                        <input type="file" onChange={(e) => uploadFileHandler(e, 'fileUrl')} accept=".pdf,.doc,.docx" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition" />
                                    </div>
                                </div>

                                {/* Format Includes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Format Includes</label>
                                    <div className="space-y-3">
                                        {formData.formatIncludes.map((include, index) => {
                                            const { icon, text } = parseInclude(include, index);
                                            return (
                                                <div key={index} className="flex bg-white dark:bg-[#1e2330] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-sm">
                                                    <div className="flex items-center justify-center w-12 bg-gray-50 dark:bg-[#252b3b] border-r border-gray-200 dark:border-gray-800 shrink-0">
                                                        <span className="text-xl">{icon}</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={text}
                                                        onChange={(e) => handleFormatIncludeChange(index, e.target.value)}
                                                        className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 outline-none w-full"
                                                        placeholder={PLACEHOLDERS[index] || 'Add a format feature...'}
                                                    />
                                                    {formData.formatIncludes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFormatInclude(index)}
                                                            className="flex items-center justify-center w-12 bg-red-50 dark:bg-[#5c2124] text-red-500 dark:text-[#f2a29f] hover:bg-red-100 dark:hover:bg-[#732a2d] transition-colors shrink-0"
                                                        >
                                                            <X size={18} strokeWidth={2.5} />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button type="button" onClick={addFormatInclude} className="mt-4 flex items-center gap-1 text-sm font-bold text-primary dark:text-accent hover:underline">
                                        <Plus size={16} /> Add another item
                                    </button>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition">{isEditing ? 'Save Changes' : 'Create E-Book'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageEbooks;
