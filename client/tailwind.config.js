/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3B5018",
                accent: "#DBEAC1",
                background: "#F9FAFB", // off-white
                darkBg: "#121212",     // dark mode background
                darkCard: "#1E1E1E",   // dark mode card background
            },
            fontFamily: {
                heading: ["Montserrat", "sans-serif"],
                body: ["Inter", "sans-serif"],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
