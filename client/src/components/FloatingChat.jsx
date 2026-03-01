import React from 'react';
import { MessageCircle } from 'lucide-react'; // Using Lucide icon for generic chat

const FloatingChat = () => {
    return (
        <a
            href="https://wa.me/8389802690"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle size={28} />
            {/* Optional tooltip */}
            <span className="absolute right-16 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
                Chat with us!
            </span>
        </a>
    );
};

export default FloatingChat;
