import { eq } from 'drizzle-orm';
import { users } from '../../database/schema';
import { formatDistanceToNow } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { User } from '#auth-utils'
/**
 * Pobiera szczegółowe dane użytkownika wraz z przypisanymi rolami
 * @param userId Identyfikator użytkownika
 * @returns Dane użytkownika wraz z rolami lub null jeśli użytkownik nie istnieje
 */
export async function getUserById(userId: number) {
    return await useDatabase().query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            bio: true,
            avatarUrl: true,
            status: true,
            isAgreedToTerms: true,
            isOAuthAccount: true,
            createdAt: true,
            updatedAt: true
        },
        with: {
            roles: {
                with: {
                    role: true,
                }
            },
        }
    })
}


/**
 * Uwierzytelnia użytkownika na podstawie adresu email i hasła.
 * 
 * Funkcja ta wyszukuje w bazie danych użytkownika o podanym adresie email,
 * a następnie weryfikuje hasło z przechowywanym hashem. Jeśli uwierzytelnianie się powiedzie,
 * zwraca obiekt użytkownika z sformatowaną datą i bez pola hasła.
 * 
 * @param body - Dane uwierzytelniające
 * @param body.email - Adres email użytkownika
 * @param body.password - Hasło do weryfikacji
 * 
 * @returns Promise rozwiązujący się do obiektu uwierzytelnionego użytkownika (bez hasła)
 * 
 * @throws {Error} Błąd 401 jeśli email nie pasuje do żadnego użytkownika
 * @throws {Error} Błąd 401 jeśli hasło jest nieprawidłowe
 */
export async function authenticateUser(body: { email: string, password: string }): Promise<User> {
    const user = await useDatabase().query.users.findFirst({
        where: eq(users.email, body.email),
        columns: {
            id: true,
            password: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            bio: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
        }
    })

    if (!user) {
        throw createError({
            status: 401,
            message: 'Invalid email'
        })
    }

    // Format the createdAt date after fetching the user
    const { createdAt: _createdAt, ...userWithFormattedDate } = {
        ...user,
        createdAtAgo: formatDistanceToNow(user.createdAt, {
            addSuffix: true, // dodaje "temu" na końcu
            locale: enGB // używa polskich formatów i nazw
        })
    };

    // Sprawdź czy hasło jest poprawne
    if (!await verifyPassword(user.password, body.password)) {
        // Zwróć użytkownika bez hasła

        throw createError({
            status: 401,
            message: 'Invalid password'
        })
    }

    // Zwróć użytkownika bez hasła
    const { password: _password, ...userWithoutPassword } = userWithFormattedDate;

    return userWithoutPassword as User;
}
