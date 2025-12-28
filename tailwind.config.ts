import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FE8C00',
                    light: '#FFF5E6',
                    dark: '#E67D00',
                },
                dark: {
                    DEFAULT: '#181C2E',
                    100: '#2A2F45',
                },
                gray: {
                    100: '#878787',
                    200: '#D1D5DB',
                    300: '#F3F4F6',
                },
                success: '#2F9B65',
                error: '#F14141',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
                'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
                'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
            },
            boxShadow: {
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
            borderRadius: {
                'card': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
