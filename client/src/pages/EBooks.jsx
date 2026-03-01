import React from 'react';

const EBooks = () => {
    const ebooks = [
        { id: 101, title: 'The Quiet Mind', price: '$15', desc: 'A 50-page digital workbook covering essential mental health maintenance.' },
        { id: 102, title: 'Morning Affirmations', price: 'FREE', desc: 'Start your day right with 30 days of powerful, grounding affirmations.' },
        { id: 103, title: 'Letting Go of Perfectionismo', price: '$20', desc: 'Practical steps to overcome the need to be perfect in every aspect of life.' },
        { id: 104, title: 'Digital Detox Guide', price: 'FREE', desc: 'A weekend plan to unplug, recharge, and rediscover the offline world.' },
    ];

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background dark:bg-darkBg flex flex-col transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-accent mb-6">E-Books & Guides</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Download our curated collection of workbooks, reading materials, and free resources to support your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ebooks.map((book) => (
                        <div key={book.id} className="bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group p-6 border border-gray-100 dark:border-gray-800 hover:border-accent dark:hover:border-primary">
                            <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center text-gray-400 dark:text-gray-500 relative overflow-hidden">
                                <span className="z-10">[ Cover: {book.title} ]</span>
                                <div className="absolute inset-0 bg-accent dark:bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 shadow-inner"></div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">{book.desc}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-xl font-bold ${book.price === 'FREE' ? 'text-green-600 dark:text-green-400' : 'text-primary dark:text-accent'}`}>{book.price}</span>
                                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${book.price === 'FREE' ? 'bg-primary dark:bg-accent text-white dark:text-primary hover:bg-opacity-90' : 'bg-accent dark:bg-gray-700 text-primary dark:text-accent hover:bg-opacity-80'}`}>
                                    {book.price === 'FREE' ? 'Download' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Signup (Good for "Free Resources" conversion) */}
                <div className="mt-24 bg-primary dark:bg-darkCard border border-transparent dark:border-gray-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10 text-white dark:text-accent">Want more free resources?</h2>
                    <p className="text-lg text-accent dark:text-gray-300 mb-8 max-w-xl mx-auto relative z-10">Join our newsletter to receive a mindful tip every Monday morning, plus exclusive access to new free downloads.</p>
                    <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4 relative z-10">
                        <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-800 dark:text-white border dark:border-gray-700" required />
                        <button type="submit" className="px-8 py-4 bg-accent dark:bg-primary text-primary dark:text-white rounded-full font-bold hover:bg-white dark:hover:bg-opacity-90 transition-colors shadow-lg">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EBooks;
