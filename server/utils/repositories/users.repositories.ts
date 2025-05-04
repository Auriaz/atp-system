import { asc, desc, eq, like, and, or, sql } from 'drizzle-orm'
import { users, roles, userRoles } from '../../database/schema'
import { formatDistanceToNow } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { User } from '#auth-utils'

/**
 * Funkcja pobierająca użytkowników z filtrowaniem
 */
// Define interfaces for query parameters and return types

interface UserFiltersQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface UserBase {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    username: string;
    avatarUrl: string | null;
    status: string | null;
    createdAt: Date;
    updatedAt: Date | null;
}

interface UserWithRoles extends UserBase {
    roles: string[];
}

interface UsersWithFiltersResult {
    users: UserWithRoles[];
    total: number;
}

export async function getUsersWithFilters(query: UserFiltersQuery): Promise<UsersWithFiltersResult> {
    const { page = 1, limit = 10, search = '', role = 'all', status = 'all', sortBy = 'id', sortOrder = 'asc' } = query;

    const db = useDatabase();
    const offset = (page - 1) * limit;

    // Budowanie warunków filtrowania
    const conditions: any[] = [];

    // Wyszukiwanie
    if (search) {
        conditions.push(
            or(
                like(users.firstName, `%${search}%`),
                like(users.lastName, `%${search}%`),
                like(users.email, `%${search}%`),
                like(users.username, `%${search}%`)
            )
        );
    }
    // Filtr po statusie
    if (status && status !== 'all') {
        conditions.push(eq(users.status, status as UserStatus));
    }

    // Pobierz podstawowe dane użytkowników
    let userQuery = db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        username: users.username,
        avatarUrl: users.avatarUrl,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
    }).from(users);

    // Zastosuj warunki filtrowania
    const filteredQuery = conditions.length
        ? userQuery.where(and(...conditions))
        : userQuery;

    // Sortowanie
    // Ensure sortBy refers to a valid column that exists in the users table
    const validSortColumns = ['id', 'firstName', 'lastName', 'email', 'username', 'status', 'createdAt', 'updatedAt'];
    const sortByColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const sortColumn = users[sortByColumn as keyof typeof users];
    const sortFunction = sortOrder === 'asc' ? asc : desc;

    // Pobierz surowe dane użytkowników
    const rawUsers = await filteredQuery
        .limit(limit)
        .offset(offset)
        .orderBy(sortFunction(sortColumn as any));

    // Pobierz role dla każdego użytkownika
    const usersWithRoles = await Promise.all(rawUsers.map(async (user: UserBase) => {
        // Pobierz role użytkownika
        const userRolesResult = await db
            .select({
                roleSlug: roles.slug
            })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .where(eq(userRoles.userId, user.id));

        return {
            ...user,
            roles: userRolesResult.map(r => r.roleSlug)
        };
    }));

    // Filtrowanie po roli - wykonywane po pobraniu ról
    let filteredUsers = usersWithRoles;
    if (role && role !== 'all') {
        filteredUsers = usersWithRoles.filter(user =>
            user.roles.includes(role)
        );
    }

    // Pobierz całkowitą liczbę użytkowników (dla paginacji)
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(conditions.length ? and(...conditions) : undefined);

    const total = Number(countResult[0]?.count) || 0;

    // Jeśli filtrujemy po roli, musimy zwrócić długość przefiltrowanej tablicy jako total
    const finalTotal = role !== 'all' ? filteredUsers.length : total;

    return {
        users: filteredUsers,
        total: finalTotal
    };
}



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
