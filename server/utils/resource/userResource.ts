import { formatDistanceToNow } from 'date-fns'
import { enGB, pl } from 'date-fns/locale'

/**
 * Transformuje dane użytkownika z bazy danych na format zasobu API
 * 
 * @param user - Dane użytkownika z bazy danych
 * @param options - Opcje formatowania (np. preferowany język)
 * @returns Sformatowany zasób użytkownika gotowy do wysłania do klienta
 */
export function toUserResource(
    user: any,
    options: {
        locale?: 'en' | 'pl',
        includeRoles?: boolean,
        includePersonalData?: boolean,
        avatarBaseUrl?: string
    } = {}
): UserResource {
    // Domyślne opcje
    const {
        locale = 'pl',
        includeRoles = true,
        includePersonalData = true,
        avatarBaseUrl = '/api/assets/avatars'
    } = options

    // Wybór lokalizacji dla formatowania daty
    const dateLocale = locale === 'pl' ? pl : enGB

    // Formatowanie dat względnych
    const createdAtAgo = user.createdAt
        ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: dateLocale })
        : ''

    const updatedAtAgo = user.updatedAt
        ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true, locale: dateLocale })
        : null

    // Formatowanie avatara
    const avatarUrl = user.avatarUrl
        ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${avatarBaseUrl}/${user.avatarUrl}`)
        : null

    // Mapowanie danych podstawowych
    const baseResource: Partial<UserResource> = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl,
        status: user.status || 'active',
        createdAtAgo,
        updatedAtAgo,
    }

    // Dodawanie ról (jeśli wymagane)
    if (includeRoles) {
        if (user.roles && Array.isArray(user.roles.map)) {
            // Jeśli mamy bezpośrednio tablicę obiektów ról
            baseResource.roles = user.roles.map((r: any) => r.role?.slug || r.roleSlug || r)
        } else if (user.roles && typeof user.roles === 'object') {
            // Jeśli role są zagnieżdżone jak w wyniku relacji Drizzle
            baseResource.roles = Object.values(user.roles)
                .map((role: any) => role?.role?.slug || role.roleSlug || role)
        } else {
            baseResource.roles = []
        }
    }

    // Dodawanie danych osobowych (jeśli wymagane)
    if (includePersonalData) {
        baseResource.firstName = user.firstName || null
        baseResource.lastName = user.lastName || null
        baseResource.bio = user.bio || null
        baseResource.isAgreedToTerms = user.isAgreedToTerms || 0
    }

    return baseResource as UserResource
}

/**
 * Transformuje kolekcję użytkowników z bazy danych na kolekcję zasobów API
 * 
 * @param users - Kolekcja użytkowników z bazy danych
 * @param options - Opcje formatowania (np. preferowany język)
 * @returns Kolekcja sformatowanych zasobów użytkownika
 */
export function toUserResourceCollection(
    users: any[],
    options: any = {}
): UserResource[] {
    return users.map(user => toUserResource(user, options))
}

/**
 * Filtruje pola zasobu użytkownika na podstawie podanych kluczy
 * 
 * @param userResource - Pełny zasób użytkownika
 * @param fields - Tablica nazw pól do zachowania
 * @returns Przefiltrowany zasób użytkownika zawierający tylko wybrane pola
 */
export function filterUserResource<T extends Partial<UserResource>>(
    userResource: T,
    fields: (keyof UserResource)[]
): Partial<T> {
    return Object.fromEntries(
        Object.entries(userResource).filter(([key]) => fields.includes(key as keyof UserResource))
    ) as Partial<T>
}

/**
 * Usuwa wybrane pola z zasobu użytkownika
 * 
 * @param userResource - Pełny zasób użytkownika
 * @param fieldsToRemove - Tablica nazw pól do usunięcia
 * @returns Zasób użytkownika bez określonych pól
 */
export function omitUserResourceFields<T extends Partial<UserResource>>(
    userResource: T,
    fieldsToRemove: (keyof UserResource)[]
): Partial<T> {
    return Object.fromEntries(
        Object.entries(userResource).filter(([key]) => !fieldsToRemove.includes(key as keyof UserResource))
    ) as Partial<T>
}
