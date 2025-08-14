/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        '@tailwindcss/postcss': {
            content: [
                './app/**/*.{js,ts,jsx,tsx,mdx}',
                './presentation/**/*.{js,ts,jsx,tsx,mdx}',
                './core/**/*.{js,ts,jsx,tsx,mdx}',
                './infrastructure/**/*.{js,ts,jsx,tsx,mdx}',
                './pages/**/*.{js,ts,jsx,tsx,mdx}',
                './components/**/*.{js,ts,jsx,tsx,mdx}',
                './src/**/*.{js,ts,jsx,tsx,mdx}',
            ],
        },
    },
};

export default config;
