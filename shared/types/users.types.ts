export type DatabaseUser = typeof tables.users.$inferSelect;

// Typy dla API i zasobów
export interface UserResource {
    id: number;
    avatarUrl: string | null;
    email: string;
    username: string;
    roles: RoleSlugs;
    status: string | null;
    createdAtAgo: string;
    updatedAtAgo: string | null;
    bio: string | null;
    firstName: string | null;
    lastName: string | null;
    isAgreedToTerms: number;
}