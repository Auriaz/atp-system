import { asc, desc, eq, like, and, or, sql } from 'drizzle-orm'
import { users, roles, userRoles, userActivities, verificationTokens, refreshTokens, oAuthAccounts } from '../../database/schema'
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
    users: UserResource[];
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
        conditions.push(eq(users.status, status as any));
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

    // Konwersja na zasoby API
    const userResources = toUserResourceCollection(filteredUsers);

    return {
        users: userResources,
        total: finalTotal
    };
}

/**
 * Pobiera szczegółowe dane użytkownika wraz z przypisanymi rolami
 * @param userId Identyfikator użytkownika
 * @returns Dane użytkownika wraz z rolami lub null jeśli użytkownik nie istnieje
 */
export async function getUserById(userId: number) {
    const userData = await useDatabase().query.users.findFirst({
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
    });

    if (!userData) return null;

    return toUserResource(userData, {
        includeRoles: true,
        includePersonalData: true
    });
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
            updatedAt: true,
            isAgreedToTerms: true,
            isOAuthAccount: true,
        },
        with: {
            roles: {
                with: {
                    role: true,
                }
            },
        }
    });

    if (!user) {
        throw createError({
            status: 401,
            message: 'Invalid email'
        });
    }

    // Sprawdź czy hasło jest poprawne
    if (!await verifyPassword(user.password, body.password)) {
        throw createError({
            status: 401,
            message: 'Invalid password'
        });
    }

    // Konwersja na zasób API, pomijając hasło
    const userResource = toUserResource(user, {
        includeRoles: true,
        includePersonalData: true
    });

    return userResource as User;
}

/**
 * Znajduje użytkownika po emailu
 * @param email Email użytkownika
 * @returns Dane użytkownika lub null
 */
export async function findUserByEmail(email: string) {
    const user = await useDatabase().query.users.findFirst({
        where: eq(users.email, email),
        columns: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            bio: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            isAgreedToTerms: true,
        },
        with: {
            roles: {
                with: {
                    role: true,
                }
            },
        }
    });

    if (!user) return null;

    return toUserResource(user);
}

/**
 * Pobiera użytkownika po nazwie użytkownika
 * @param username Nazwa użytkownika
 * @returns Dane użytkownika lub null
 */
export async function findUserByUsername(username: string) {
    const user = await useDatabase().query.users.findFirst({
        where: eq(users.username, username),
        columns: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            bio: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            isAgreedToTerms: true,
        },
        with: {
            roles: {
                with: {
                    role: true,
                }
            },
        }
    });

    if (!user) return null;

    return toUserResource(user);
}

/**
 * Aktualizuje dane profilowe użytkownika
 * @param userId Identyfikator użytkownika
 * @param data Dane do aktualizacji
 * @returns Zaktualizowane dane użytkownika
 */
export async function updateUserProfile(userId: number, data: Partial<ProfileForm>) {
    // Usuwamy pola, które nie są kolumnami w tabeli users
    const updateResult = await useDatabase()
        .update(users)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            bio: users.bio,
            avatarUrl: users.avatarUrl,
            status: users.status,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            isAgreedToTerms: users.isAgreedToTerms,
        });

    if (updateResult.length === 0) {
        throw createError({
            status: 404,
            message: 'User not found'
        });
    }

    // Pobieramy użytkownika z rolami
    return updateResult[0];
}

/**
 * Funkcja do zmiany avatara użytkownika
 * @param user - Użytkownik, którego avatar ma być zmieniony
 * @param file - Plik obrazu do zapisania jako avatar
 * @returns Obiekt zawierający URL nowego avatara oraz wiadomość o powodzeniu
 */
export async function updateUserAvatarUrl(userId: number, avatarUrl: string) {
    // Aktualizacja URL avatara w bazie danych
    const db = useDatabase();
    const updatedUser = await db
        .update(users)
        .set({
            avatarUrl: avatarUrl,
            updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            bio: users.bio,
            avatarUrl: users.avatarUrl,
            status: users.status,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        });


    if (!updatedUser.length) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        });
    }

    return toUserResource(updatedUser[0]);
}

export async function checkExistingAvatarUrl(userId: number) {
    const db = useDatabase();
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            avatarUrl: true
        }
    });

    return user?.avatarUrl || null;
}


export async function createUser(userData: any) {
    const db = useDatabase()

    // Generate username from email if not provided
    const username = userData.username || userData.email.split('@')[0]

    const newUser = await db
        .insert(users)
        .values({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: username,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning()

    if (!newUser[0]) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create user'
        })
    }

    // Assign role to user
    if (userData.role) {
        const roleResult = await db.query.roles.findFirst({
            where: eq(roles.slug, userData.role)
        })

        if (roleResult) {
            await db.insert(userRoles).values({
                userId: newUser[0].id,
                roleId: roleResult.id,
                assignedAt: new Date()
            })
        }
    }

    // Return user with roles
    return await getUserById(newUser[0].id)
}

/**
 * Usuwa użytkownika wraz z powiązanymi danymi
 * @param userId Identyfikator użytkownika do usunięcia
 * @returns Informacje o usuniętym użytkowniku
 */
export async function deleteUser(userId: number) {
    const db = useDatabase()

    // Najpierw pobierz dane użytkownika przed usunięciem
    const userToDelete = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            status: true
        },
        with: {
            roles: {
                with: {
                    role: true
                }
            }
        }
    })

    if (!userToDelete) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    // Sprawdź czy użytkownik ma rolę admin i czy nie jest ostatnim adminem
    const userRolesList = userToDelete.roles.map(ur => ur.role.slug)
    if (userRolesList.includes('admin')) {
        const activeAdminsCount = await db
            .select({ count: sql`count(DISTINCT ${users.id})` })
            .from(users)
            .innerJoin(userRoles, eq(users.id, userRoles.userId))
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .where(and(
                eq(roles.slug, 'admin'),
                eq(users.status, 'active')
            ))

        const adminCount = Number(activeAdminsCount[0]?.count) || 0
        if (adminCount <= 1) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Cannot delete the last active administrator'
            })
        }
    }

    // Najpierw usuń powiązania z rolami
    await db
        .delete(userRoles)
        .where(eq(userRoles.userId, userId))

    await db
        .delete(userActivities)
        .where(eq(userActivities.userId, userId))

    await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.userId, userId))

    await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.userId, userId))

    await db
        .delete(oAuthAccounts)
        .where(eq(oAuthAccounts.userId, userId))


    // Następnie usuń użytkownika
    const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            username: users.username
        })

    if (!deletedUser[0]) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete user'
        })
    }

    return {
        success: true,
        deletedUser: {
            id: deletedUser[0].id,
            firstName: deletedUser[0].firstName,
            lastName: deletedUser[0].lastName,
            email: deletedUser[0].email,
            username: deletedUser[0].username,
            roles: userRolesList
        },
        deletedAt: new Date().toISOString()
    }
}