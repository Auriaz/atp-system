/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './assets/**/*.css',
        './nuxt.config.{js,ts}'
    ],
    theme: {
        extend: {
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
                }
            },
            // Dodaj inne rozszerzenia, które mogą być potrzebne
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
    // Dodaj obsługę wariantów dla opacity
    safelist: [
        'opacity-0',
        'opacity-5',
        'opacity-10',
        'opacity-20',
        'opacity-30',
        'opacity-40',
        'opacity-50',
        'opacity-60',
        'opacity-70',
        'opacity-80',
        'opacity-90',
        'opacity-100',
    ]
}