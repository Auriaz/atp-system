import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    // Definicje kolekcji
    collections: {
        docs: defineCollection({
            source: 'docs/**/*.md', // Źródło dokumentów
            type: 'page', // Typ kolekcji
            // Schemat walidacji dla dokumentów ATP System
            schema: z.object({
                // Podstawowe pola
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),

                // Kategorie i klasyfikacja
                category: z.enum([
                    'Development',
                    'Administracja',
                    'Użytkownicy',
                    'Trenerzy',
                    'Zawodnicy',
                    'Menedżerowie',
                    'Edytorzy',
                    'Publiczne',
                    'Raporty',
                    'Poradniki',
                    'FAQ',
                    'API',
                    'Project Management'
                ]).optional(),

                tags: z.array(z.string()).optional(),

                // Metadane dokumentu
                version: z.string().optional(),
                lastUpdated: z.string().optional(), // Format: 'YYYY-MM-DD'
                createdAt: z.string().optional(),   // Format: 'YYYY-MM-DD'
                author: z.string().optional(),

                // Kontrola dostępu i ról
                requiredRole: z.union([
                    z.string(),
                    z.array(z.enum([
                        'admin',
                        'manager',
                        'coach',
                        'athlete',
                        'editor',
                        'user',
                        'developer',
                        'public'
                    ]))
                ]).optional(),

                // Nawigacja i wyświetlanie
                navigation: z.object({
                    title: z.string().optional(),
                    icon: z.string().optional(),
                    order: z.number().optional(),
                    badge: z.string().optional(),
                    group: z.string().optional()
                }).optional(),

                // Ustawienia wyświetlania
                icon: z.string().optional(),
                color: z.string().optional(),
                featured: z.boolean().default(false),

                // SEO i metadane
                seo: z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    keywords: z.array(z.string()).optional()
                }).optional(),

                // Wymagania systemowe
                requirements: z.array(z.string()).optional(),

                // Powiązania z innymi dokumentami
                related: z.array(z.string()).optional(),

                // Status dokumentu
                status: z.enum(['draft', 'review', 'published', 'archived']).default('published'),

                // Poziom trudności (dla dokumentacji technicznej)
                difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),

                // Czas potrzebny na przeczytanie (w minutach)
                readingTime: z.number().optional(),

                // Typ dokumentu
                docType: z.enum([
                    'guide',        // Przewodnik
                    'reference',    // Dokumentacja referencyjna
                    'tutorial',     // Tutorial
                    'faq',         // FAQ
                    'report',      // Raport
                    'changelog',   // Lista zmian
                    'overview',    // Przegląd
                    'specification' // Specyfikacja
                ]).optional(),
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
        }), faq: defineCollection({
            source: 'faq/**/*.md',
            type: 'page',
            schema: z.object({
                // Podstawowe pola
                title: z.string().min(1, 'Tytuł jest wymagany'),
                description: z.string().optional(),

                // Metadane
                version: z.string().optional(),
                lastUpdated: z.string().optional(),
                createdAt: z.string().optional(),
                author: z.string().optional(),

                // Kategorie i klasyfikacja
                category: z.string().default('general'),
                tags: z.array(z.string()).optional(),

                // Kontrola dostępu
                requiredRole: z.union([
                    z.string(),
                    z.array(z.enum([
                        'admin',
                        'manager',
                        'coach',
                        'athlete',
                        'editor',
                        'user',
                        'developer',
                        'public'
                    ]))
                ]).optional(),

                // Nawigacja i wyświetlanie
                navigation: z.object({
                    title: z.string().optional(),
                    icon: z.string().optional(),
                    order: z.number().optional(),
                    badge: z.string().optional(),
                    group: z.string().optional()
                }).optional(),

                icon: z.string().optional(),
                featured: z.boolean().default(false),
                order: z.number().default(0),

                // SEO i metadane
                seo: z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    keywords: z.array(z.string()).optional()
                }).optional(),

                // Powiązania
                related: z.array(z.string()).optional(),

                // Status i typ dokumentu
                status: z.enum(['draft', 'review', 'published', 'archived']).default('published'),
                docType: z.enum([
                    'guide',
                    'reference',
                    'tutorial',
                    'faq',
                    'report',
                    'changelog',
                    'overview',
                    'specification'
                ]).optional(),

                // Poziom trudności i czas czytania
                difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
                readingTime: z.number().optional(),

                // Lokalizacja
                language: z.string().default('pl')
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