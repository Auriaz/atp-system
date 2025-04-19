export default defineAppConfig({
    ui: {
        theme: {
            colors: [
                // Podstawowe kolory
                'primary',
                'secondary',
                'blue',
                'info',
                'success',
                'warning',
                'error',
                'green',

                // Kolory dla systemu ról
                'indigo',    // Manager
                'violet',    // Editor
                'orange',    // Athlete
                'gray',      // Observer
                'emerald',   // Przyszłe role (np. Nutritionist)

                // Dodatkowe kolory użyteczne w aplikacji
                'sky',
                'teal',
                'amber',
                'rose',
                'slate'
            ]
        },
        // colors: {
        //     tertiary: 'indigo'
        // }
    }
})