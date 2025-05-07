import { H3Event } from 'h3'
import { userActivities } from '../../database/schema'
import { eq, desc, lt } from 'drizzle-orm'

/**
 * Pobiera adres IP klienta z żądania H3
 * 
 * @param event - Obiekt wydarzenia H3
 * @returns Adres IP klienta lub null
 */
export function getClientIp(event: H3Event): string | null {
    // Próba pobrania z nagłówków przesyłanych przez load balancer/proxy
    const forwardedFor = event.node.req.headers['x-forwarded-for']
    if (forwardedFor) {
        return Array.isArray(forwardedFor)
            ? forwardedFor[0]?.split(',')[0]?.trim()
            : forwardedFor.split(',')[0]?.trim()
    }

    // Próba pobrania z socket connection
    return event.node.req.socket.remoteAddress || null
}

/**
 * Loguje aktywność użytkownika w systemie
 * 
 * @param options - Opcje logowania aktywności
 * @returns Promise<void>
 */
export async function logUserActivity(options: LogActivityOptions): Promise<void> {
    try {
        const { userId, action, ip, userAgent, details, targetId, targetType } = options

        await useDatabase()
            .insert(userActivities)
            .values({
                userId,
                action,
                ip: ip || null,
                userAgent: userAgent || null,
                details: details ? JSON.stringify(details) : null,
                // Only include fields that exist in the schema
                createdAt: new Date(),
            })
            .execute()
    } catch (error) {
        console.error('Błąd podczas logowania aktywności użytkownika:', error)
        // Nie rzucamy błędu dalej, aby nie przerywać głównego flow aplikacji z powodu błędu logowania
    }
}

/**
 * Loguje aktywność użytkownika na podstawie wydarzenia H3
 * 
 * @param event - Obiekt wydarzenia H3
 * @param userId - ID użytkownika
 * @param action - Typ akcji
 * @param details - Szczegóły akcji
 * @param targetId - ID obiektu docelowego
 * @param targetType - Typ obiektu docelowego
 * @returns Promise<void>
 */
export async function logUserActivityFromEvent(
    event: H3Event,
    userId: number,
    action: UserActivityType | string,
    details?: any,
    targetId?: number,
    targetType?: string
): Promise<void> {
    return logUserActivity({
        userId,
        action,
        ip: getClientIp(event),
        userAgent: event.node.req.headers['user-agent']?.toString() || null,
        details,
        targetId,
        targetType
    })
}

/**
 * Pobiera historię aktywności użytkownika
 * 
 * @param userId - ID użytkownika
 * @param limit - Limit wyników
 * @param offset - Offset wyników
 * @returns Promise z listą aktywności użytkownika
 */
export async function getUserActivityHistory(
    userId: number,
    limit: number = 50,
    offset: number = 0
) {
    try {
        const activities = await useDatabase()
            .select()
            .from(tables.userActivities)
            .where(eq(tables.userActivities.userId, userId))
            .orderBy(desc(tables.userActivities.createdAt))
            .limit(limit)
            .offset(offset)

        return activities.map(activity => ({
            ...activity,
            details: activity.details ? JSON.parse(activity.details) : null
        }))
    } catch (error) {
        console.error('Błąd podczas pobierania historii aktywności użytkownika:', error)
        throw error
    }
}

/**
 * Czyści historię aktywności użytkownika starszą niż podana liczba dni
 * 
 * @param days - Liczba dni, po których aktywności powinny zostać usunięte
 * @returns Promise<number> - Liczba usuniętych rekordów
 */
export async function cleanupOldUserActivities(days: number = 90): Promise<number> {
    try {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const result = await useDatabase()
            .delete(tables.userActivities)
            .where(lt(tables.userActivities.createdAt, cutoffDate))
            .execute()

        return result.length
    } catch (error) {
        console.error('Błąd podczas czyszczenia historii aktywności użytkowników:', error)
        throw error
    }
}
