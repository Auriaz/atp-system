export type DatabaseUser = typeof tables.users.$inferSelect

export interface IUserResource {
    id: number;
    avatarUrl: string | null;
    email: string;
    username: string;
    role: UserRole | null;
    status: string | null;
    createdAtAgo: string;
    updatedAtAgo: string | null;
    bio: string | null;
    firstName: string | null;
    lastName: string | null;
    isAgreedToTerms: number;
}
