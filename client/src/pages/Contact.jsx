import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: '' });

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/contact', formData, config);

            if (data.success) {
                setStatus({ loading: false, success: true, error: '' });
                setFormData({ name: '', email: '', message: '' }); // reset
            }
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            setStatus({ loading: false, success: false, error: message });
        }
    };
    return (
        <div className="pt-24 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-accent mb-6 text-center">Get In Touch</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-16">
                    Whether you have a question about a course, need technical support, or just want to say hello, we're here for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-darkCard p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Send a Message</h2>

                        {status.success && (
                            <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-xl mb-6">
                                Message sent successfully! We will get back to you soon.
                            </div>
                        )}
                        {status.error && (
                            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-xl mb-6">
                                {status.error}
                            </div>
                        )}

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent transition-all resize-none" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" disabled={status.loading} className="w-full py-4 bg-primary dark:bg-accent text-white dark:text-primary rounded-lg font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed">
                                {status.loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col justify-center space-y-8 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Other ways to connect</h2>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-accent dark:bg-gray-800 rounded-full flex items-center justify-center text-primary dark:text-accent flex-shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email Us</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-1">Our friendly team is here to help.</p>
                                <a href="mailto:support@healthymotive.com" className="text-primary dark:text-accent font-semibold hover:underline">support@healthymotive.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-accent dark:bg-gray-800 rounded-full flex items-center justify-center text-primary dark:text-accent flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">WhatsApp Chat</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-1">Instant support during business hours.</p>
                                <a href="https://wa.me/8389802690" className="text-primary dark:text-accent font-semibold hover:underline">+91 8389802690</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-accent dark:bg-gray-800 rounded-full flex items-center justify-center text-primary dark:text-accent flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Office</h3>
                                <p className="text-gray-600 dark:text-gray-400">Global HQ</p>
                                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Remote Working Space</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
