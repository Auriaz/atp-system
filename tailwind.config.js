import { vi } from 'date-fns/locale';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    theme: {
        extend: {
            // Add custom screen breakpoints
            screens: {
                'xs': '475px',
                // sm, md, lg, xl, 2xl are already defined by default
            },
            // Dodaj rozszerzenia dla opacity w tekście i krawędziach
            opacity: {
                '5': '0.05',
                '30': '0.3',
                '60': '0.6',
                '80': '0.8',
                '90': '0.9',
            },
            colors: {
                primary: {
                    '300': 'var(--color-primary-300)',
                    '600': 'var(--color-primary-600)',
                    '800': 'var(--color-primary-800)',
                    '900': 'var(--color-primary-900)',
                },
                gray: {
                    '100': '#f5f5f5', // Adding fallback for gray.100
                    '300': '#e0e0e0',
                    '500': '#9e9e9e',
                    '700': '#616161',
                    '900': '#212121',
                },
                violet: 'var(--color-violet)',
            },
            // Dodaj inne rozszerzenia, które mogą być potrzebne
        }
    },
    plugins: [
        require('@tailwindcss/typography'),

    ]
}