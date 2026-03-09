import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const GuidedAudioPaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [audio, setAudio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [paymentScreenshot, setPaymentScreenshot] = useState('');
    const [uploading, setUploading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollError, setEnrollError] = useState('');

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
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setPaymentScreenshot(`http://localhost:5000${data.file}`);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('File upload failed! Please try again.');
        }
    };

    const submitPaymentHandler = async () => {
        if (!paymentScreenshot) {
            setEnrollError('Please upload a payment screenshot first.');
            return;
        }

        setEnrolling(true);
        setEnrollError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/guidedaudios/${id}/purchase`, { paymentScreenshot }, config);
            setEnrolling(false);
            alert('Payment submitted successfully! Your Guided Audio will be available soon.');

            navigate('/', { replace: true });
            setTimeout(() => {
                navigate('/my-courses');
            }, 50);
        } catch (err) {
            setEnrollError(err.response?.data?.message || err.message);
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg flex justify-center transition-colors duration-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary dark:border-accent"></div>
            </div>
        );
    }

    if (error || !audio) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg container mx-auto px-6 transition-colors duration-300">
                <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl max-w-2xl mx-auto">
                    <p className="font-bold">Error</p>
                    <p>{error || 'Guided Audio not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-background dark:bg-darkCard rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-800 text-center">

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Scan the QR code and make payment</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
                        You are buying: <span className="text-primary dark:text-accent font-bold">{audio.title}</span> for ${audio.price}
                    </p>

                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-4 rounded-xl shadow-md inline-block border-2 border-gray-100">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                alt="UPI QR Code"
                                className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                            />
                        </div>
                    </div>

                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-left">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                            Choose File / Upload Screenshot Here
                        </label>

                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            accept="image/*"
                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-opacity-90 transition mb-4"
                        />

                        {uploading && <p className="text-primary dark:text-accent font-bold text-center mb-4">Uploading image...</p>}

                        {paymentScreenshot && (
                            <div className="mb-4">
                                <p className="text-green-600 dark:text-green-400 text-sm font-bold text-center mb-2">Screenshot uploaded successfully!</p>
                                <img src={paymentScreenshot} alt="Payment Proof" className="h-32 object-contain mx-auto rounded-lg border border-gray-200 dark:border-gray-700" />
                            </div>
                        )}

                        {enrollError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold text-center">
                                {enrollError}
                            </div>
                        )}

                        <button
                            onClick={submitPaymentHandler}
                            disabled={enrolling || uploading || !paymentScreenshot}
                            className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-xl font-bold hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-md"
                        >
                            {enrolling ? 'Submitting...' : 'Submit Payment'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GuidedAudioPaymentPage;
