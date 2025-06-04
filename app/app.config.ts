export default defineAppConfig({
    ui: {
        colors: {
            primary: 'cyan',
            secondary: 'blue',
            tertiary: 'green',

            success: 'green',
            info: 'cyan',
            neutral: 'slate',
            warning: 'orange',
            error: 'red',

            admin: 'violet',
            manager: 'indigo',
            coach: 'blue',
            editor: 'green',
            athlete: 'yellow',
            user: 'orange',
            observer: 'red',

            // Seven hierarchy levels (highest to lowest)
            highest: 'violet',      // Highest level
            veryHigh: 'indigo',     // Very high level
            high: 'blue',           // High level
            medium: 'green',        // Medium level
            low: 'yellow',          // Low level
            veryLow: 'orange',      // Very low level
            lowest: 'red',          // Lowest level
        }
    }
})