/**
 * Interfejs dla opcji logowania aktywności
 */
export interface LogActivityOptions {
    userId: number;
    action: UserActivityType | string;
    ip?: string | null;
    userAgent?: string | null;
    details?: any;
    targetId?: number | null;
    targetType?: string | null;
}
