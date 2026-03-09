import React, { useState } from 'react';
import ManageUsers from '../components/admin/ManageUsers';
import ManageCourses from '../components/admin/ManageCourses';
import ManageEbooks from '../components/admin/ManageEbooks';
import ManageFreeResources from '../components/admin/ManageFreeResources';
import ManageGuidedAudios from '../components/admin/ManageGuidedAudios';
import ManageEnrollments from '../components/admin/ManageEnrollments';
import ManageEbookEnrollments from '../components/admin/ManageEbookEnrollments';
import ManageGuidedAudioEnrollments from '../components/admin/ManageGuidedAudioEnrollments';
import ManageFreeResourceEnrollments from '../components/admin/ManageFreeResourceEnrollments';
import { Users, BookOpen, FileText, Gift, Headphones, UserCheck, BookOpenCheck, Music, FileDown } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'ebooks', label: 'E-Books', icon: FileText },
        { id: 'resources', label: 'Free Resources', icon: Gift },
        { id: 'audio', label: 'Guided Audio', icon: Headphones },
        { id: 'enrollments', label: 'Course Enrollments', icon: UserCheck },
        { id: 'ebook-enrollments', label: 'E-Book Enrollments', icon: BookOpenCheck },
        { id: 'audio-enrollments', label: 'Audio Enrollments', icon: Music },
        { id: 'resource-downloads', label: 'Resource Downloads', icon: FileDown },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <ManageUsers />;
            case 'courses': return <ManageCourses />;
            case 'ebooks': return <ManageEbooks />;
            case 'resources': return <ManageFreeResources />;
            case 'audio': return <ManageGuidedAudios />;
            case 'enrollments': return <ManageEnrollments />;
            case 'ebook-enrollments': return <ManageEbookEnrollments />;
            case 'audio-enrollments': return <ManageGuidedAudioEnrollments />;
            case 'resource-downloads': return <ManageFreeResourceEnrollments />;
            default: return <ManageUsers />;
        }
    };

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-background dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-7xl relative">
                <h1 className="text-4xl font-extrabold text-primary dark:text-accent mb-8 text-center md:text-left h-12 flex items-center justify-center md:justify-start">
                    Admin Dashboard
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-darkCard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sticky top-32">
                            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Content Manager</h3>
                            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left w-full ${isActive
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary dark:hover:text-accent'
                                                }`}
                                        >
                                            <Icon size={20} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="leading-tight">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
