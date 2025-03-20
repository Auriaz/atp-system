import type { User } from '#auth-utils'
import { formatDistanceToNow } from 'date-fns'
import { enGB } from 'date-fns/locale'

// Typ dla użytkownika z bazy danych
type DatabaseUser = typeof tables.users.$inferSelect

// Funkcja konwertująca użytkownika z bazy danych na bezpieczny resource
export const userResource = (user: DatabaseUser): User => {
    // Zwracamy obiekt User bez hasła
    const createdDate = new Date(user.createdAt);

    return {
        id: user.id, // Konwersja na string
        avatarUrl: user.avatarUrl ? user.avatarUrl : '',
        email: user.email,
        username: user.username,
        createdAtAgo: formatDistanceToNow(createdDate, {
            addSuffix: true, // dodaje "temu" na końcu
            locale: enGB // używa polskich formatów i nazw
        }),
    }
}