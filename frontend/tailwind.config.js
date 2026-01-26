/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f5ff',
                    100: '#e0ebff',
                    200: '#c7daff',
                    300: '#a3c0ff',
                    400: '#7a9eff',
                    500: '#5376ff',
                    600: '#3d55ef',
                    700: '#2f41d6',
                    800: '#2836ae',
                    900: '#25318a',
                    950: '#161b51',
                },
            },
            borderRadius: {
                '5xl': '2.5rem',
            },
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', 'sans-serif'],
            },
            boxShadow: {
                'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
                'luxury-hover': '0 30px 60px -12px rgba(61, 85, 239, 0.12)',
                'glow': '0 0 15px rgba(61, 85, 239, 0.4)',
            },
            animation: {
                'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
            },
            keyframes: {
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                }
            }
        },
    },
    plugins: [],
}
