import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [occupation, setOccupation] = useState('');
    const [hobby, setHobby] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setMiddleName(user.middleName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phoneNumber || '');
            setAddress(user.address || '');
            setProfilePicture(user.profilePicture || '');
            setOccupation(user.occupation || '');
            setHobby(user.hobby || '');
        }
    }, [user]);

    const isProfileComplete = user && user.address && user.profilePicture && user.occupation && user.hobby;

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            // Convert to a full absolute URL for the frontend
            const fullImageUrl = `http://localhost:5000${data.file}`;
            setProfilePicture(fullImageUrl);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const result = await updateProfile({
            name,
            middleName,
            lastName,
            email,
            phoneNumber,
            address,
            profilePicture,
            occupation,
            hobby,
        });

        if (result.success) {
            setMessage('Successfully updated your profile.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-3xl relative">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-8 text-center md:text-left md:ml-0 h-12 flex items-center justify-center md:justify-start">
                    My Profile
                </h1>

                {!isProfileComplete && (
                    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-5 rounded-xl mb-10 shadow-sm">
                        <p className="font-bold text-lg mb-1">Incomplete Profile</p>
                        <p>Please complete your profile by filling out the remaining fields (Address, Profile Picture, Occupation, and Hobby).</p>
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-xl mb-8">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-darkCard rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800">
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Middle Name</label>
                                <input
                                    type="text"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white cursor-not-allowed transition-colors"
                                    readOnly
                                    title="Email cannot be changed"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Additional Details</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                        placeholder="123 Wellness Avenue, NY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadFileHandler}
                                        className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors mb-2"
                                    />
                                    {uploading && <p className="text-sm text-primary dark:text-accent font-bold mt-1">Uploading Image...</p>}
                                    {profilePicture && (
                                        <div className="mt-3 w-20 h-20 rounded-full overflow-hidden border-2 border-primary dark:border-accent">
                                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Occupation</label>
                                        <input
                                            type="text"
                                            value={occupation}
                                            onChange={(e) => setOccupation(e.target.value)}
                                            className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                            placeholder="Student, Engineer, etc."
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hobby</label>
                                        <input
                                            type="text"
                                            value={hobby}
                                            onChange={(e) => setHobby(e.target.value)}
                                            className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-colors"
                                            placeholder="Reading, Chess, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 mt-8 bg-primary dark:bg-accent text-white dark:text-primary rounded-xl font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all"
                        >
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
