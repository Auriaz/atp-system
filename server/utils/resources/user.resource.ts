import type { User } from '#auth-utils'
import { formatDistanceToNow } from 'date-fns'
import { enGB } from 'date-fns/locale'

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

export const usersResource = (users: DatabaseUser[]): IUserResource[] => {
    return users.map((user) => {
        const createdDate = new Date(user.createdAt);
        const updatedDate = user.updatedAt ? new Date(user.updatedAt) : null;
        return {
            id: user.id, // Konwersja na string
            avatarUrl: user.avatarUrl ? user.avatarUrl : '',
            email: user.email,
            username: user.username,
            status: user.status, // Provide empty string as default when null
            bio: user.bio,
            firstName: user.firstName,
            lastName: user.lastName,
            isAgreedToTerms: user.isAgreedToTerms,
            createdAtAgo: formatDistanceToNow(createdDate, {
                addSuffix: true, // dodaje "temu" na końcu
                locale: enGB // używa polskich formatów i nazw
            }),
            updatedAtAgo: updatedDate ? formatDistanceToNow(updatedDate, {
                addSuffix: true, // dodaje "temu" na końcu
                locale: enGB // używa polskich formatów i nazw
            }) : null
        };
    });
}