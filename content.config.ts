import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    // Definicje kolekcji
    collections: {
        docs: defineCollection({
            source: 'docs/**/*.md', // Źródło dokumentów
            type: 'page', // Typ kolekcji
            // Schemat walidacji dla dokumentów
            schema: z.object({
                // Podstawowe pola
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),
                navigation: z.boolean().default(true), // czy dokument ma być widoczny w nawigacji

                // Kategorie i tagi
                category: z.string().optional(),
                tags: z.array(z.string()).optional(),

                // Metadane
                createdAt: z.string().datetime().optional(),
                updatedAt: z.string().datetime().optional(),
                version: z.string().optional(),

                // Kontrola dostępu
                requiredRole: z.union([
                    z.string(),
                    z.array(z.string())
                ]).optional(),

                // Ustawienia wyświetlania
                icon: z.string().optional(),
                color: z.string().optional(),

                // SEO
                seo: z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    keywords: z.array(z.string()).optional()
                }).optional(),

                // Powiązanie z innymi dokumentami
                related: z.array(z.string()).optional(),
                author: z.string().optional(),
            })
        }),
        materials: defineCollection({
            source: 'docs/*.md', // Źródło dokumentów
            type: 'page', // Typ kolekcji
            schema: z.object({
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),
                category: z.string().optional(),
                contentType: z.enum(['article', 'video', 'pdf', 'interactive']),

                // Kontrola dostępu
                requiredRole: z.union([
                    z.string(),
                    z.array(z.string())
                ]).optional(),

                // Metadane treningowe
                difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
                duration: z.number().optional(), // w minutach

                // Powiązane materiały
                prerequisites: z.array(z.string()).optional(),
                nextSteps: z.array(z.string()).optional()
            }),
        }),
        faq: defineCollection({
            source: 'docs/public/*.md', // Źródło dokumentów
            type: 'page', // Typ kolekcji
            schema: z.object({
                question: z.string().min(1, 'Pytanie jest wymagane'),
                answer: z.string().min(1, 'Odpowiedź jest wymagana'),
                category: z.string().optional(),

                // Czy pytanie jest często zadawane
                isFeatured: z.boolean().default(false),

                // Kontrola dostępu
                requiredRole: z.union([
                    z.string(),
                    z.array(z.string())
                ]).optional()
            })
        }),

    },
    // // Konfiguracja parsera Markdown
    // markdown: {
    //   // Konfiguracja generowania spisu treści
    //   toc: {
    //     depth: 4,
    //     searchDepth: 5
    //   },
    //   // Konfiguracja podświetlania składni
    //   highlight: {
    //     theme: {
    //       default: 'github-light',
    //       dark: 'github-dark',
    //       sepia: 'monokai'
    //     },
    //     preload: ['typescript', 'vue', 'bash', 'markdown', 'json', 'css', 'html']
    //   }
    // },

    // Konfiguracja wyszukiwania
    // search: {
    //   // Włącz wyszukiwanie pełnotekstowe
    //   full: true
    // },

    // // Konfiguracja nawigacji
    // navigation: {
    //   // Pola używane do generowania nawigacji
    //   fields: ['title', 'description', 'category', 'navigation', 'icon']
    // }
})