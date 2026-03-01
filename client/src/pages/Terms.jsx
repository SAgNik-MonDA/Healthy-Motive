import React from 'react';

const Terms = () => {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-darkBg text-gray-800 dark:text-gray-300 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-8 border-b-2 border-accent dark:border-gray-800 pb-6">Terms & Conditions</h1>

                <div className="space-y-8 text-lg leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this site will constitute acceptance of this agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Access to Courses and Resources</h2>
                        <p>Upon successful payment for a course or e-book, you will be granted access to the respective digital materials. All digital products are for individual use only and may not be shared, reproduced, or resold without explicit written permission from Healthy Motive.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Refund Policy</h2>
                        <p>We stand behind the quality of our content. If you are not completely satisfied with your course purchase within the first 14 days, you may request a refund by contacting our support team. Refunds for digital downloads (e-books) are evaluated on a case-by-case basis.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Account</h2>
                        <p>To purchase courses or save progress, you may be required to register an account.</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>You are responsible for maintaining the confidentiality of your account password.</li>
                            <li>You are responsible for all activities that occur under your account.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate our community guidelines.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Modifications to Service</h2>
                        <p>We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice at any time.</p>
                        <p>Prices of all products, including but not limited to courses and e-books, are subject to change upon notice from us.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact</h2>
                        <p>If you have any questions regarding these Terms, please contact us at <a href="mailto:support@healthymotive.com" className="text-primary dark:text-accent font-semibold hover:underline">support@healthymotive.com</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
