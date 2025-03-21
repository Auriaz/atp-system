export type DatabaseUser = typeof tables.users.$inferSelect

export interface IUserResource {
    id: number;
    avatarUrl: string;
    email: string;
    username: string;
    status: string | null;
    createdAtAgo: string;
    updatedAtAgo: string | null;
    bio: string | null;
    firstName: string | null;
    lastName: string | null;
    isAgreedToTerms: number;
}
