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

export interface UserFilters {
    search?: string;
    role?: string;
    status?: string;
}

export interface SortOptions {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export type UserQueryOptions = UserFilters & SortOptions & PaginationOptions;