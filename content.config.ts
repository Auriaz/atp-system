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
            source: 'faq/**/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),
                language: z.string().default('en'),
                category: z.string().default('general'),
                order: z.number().default(0),
                tags: z.array(z.string()).optional(),
                featured: z.boolean().default(false),
                icon: z.string().optional(),
                lastUpdated: z.string().datetime().optional(),
            })
        }),

        // Nowa kolekcja dla warunków korzystania
        legal: defineCollection({
            source: 'legal/**/*.md', // Źródło dokumentów - uwzględnia wersje językowe
            type: 'page', // Typ kolekcji
            schema: z.object({
                // Podstawowe pola
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),

                // Metadane
                language: z.string().default('en'), // Język dokumentu (en, pl, itd.)
                version: z.string().optional(), // Wersja warunków
                effectiveDate: z.string().datetime().optional(), // Data wejścia w życie
                lastUpdated: z.string().datetime().optional(), // Data ostatniej aktualizacji

                // Sekcje dokumentu (opcjonalne - dla lepszej organizacji)
                sections: z.array(z.object({
                    title: z.string(),
                    anchor: z.string().optional()
                })).optional(),

                // Powiązane dokumenty
                relatedDocuments: z.array(z.object({
                    title: z.string(),
                    path: z.string()
                })).optional(),

                // Kontakt
                contactEmail: z.string().email().optional()
            })
        }),

        // // Można też dodać kolekcję dla polityki prywatności
        // privacy: defineCollection({
        //     source: 'privacy/**/*.md',
        //     type: 'page',
        //     schema: z.object({
        //         title: z.string().min(1, 'Tytuł jest wymagany'),
        //         description: z.string().optional(),
        //         language: z.string().default('en'),
        //         version: z.string().optional(),
        //         effectiveDate: z.string().datetime().optional(),
        //         lastUpdated: z.string().datetime().optional(),
        //         dataController: z.string().optional(), // Nazwa administratora danych
        //         contactEmail: z.string().email().optional()
        //     })
        // }),

    },
})