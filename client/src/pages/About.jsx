import React from 'react';

const About = () => {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-darkBg transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-accent mb-12 text-center">About My Journey</h1>

                <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0 flex items-center justify-center shadow-xl border-[8px] border-background dark:border-darkCard relative">
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">[ My Photo ]</span>
                        <div className="absolute inset-0 rounded-full border border-accent dark:border-primary blur-sm"></div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Hello, I'm the Founder.</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            For years, I struggled with the overwhelming noise of the "hustle culture." I felt anxious, burned out, and disconnected from what truly mattered. I read every self-help book out there, but most of them felt too loud—too aggressive.
                        </p>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            That's when I realized: motivation shouldn't make you anxious. It should bring you peace.
                        </p>
                    </div>
                </div>

                <div className="bg-background dark:bg-darkCard border-l-4 border-primary dark:border-accent p-8 rounded-r-2xl mb-16 shadow-sm">
                    <p className="text-xl italic text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                        "Healthy Motive was created to make motivation practical, peaceful, and life-changing — not noisy."
                    </p>
                </div>

                <div className="space-y-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Why I Started Healthy Motive</h3>
                    <p>
                        I launched this platform to bridge the gap between mental well-being and personal growth. I wanted to build a sanctuary where people could come to learn, heal, and grow without feeling inadequate.
                    </p>
                    <p>
                        Every course, e-book, and resource on this site is crafted with the intention of helping you build a life that feels good on the inside, rather than one that just looks good on the outside.
                    </p>
                    <p>
                        Thank you for being here. I can't wait to see you grow.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
