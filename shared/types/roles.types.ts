// Typy dla modeli bazy danych
export interface Role {
    id: number;
    name: string;
    slug: RoleSlug;
    description?: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt?: Date | null;
}

export interface UserRole {
    id: number;
    userId: number;
    roleId: number;
    assignedAt: Date;
    assignedBy?: number | null;
}

export interface UserRoleWithDetails extends UserRole {
    role: Role;
    assignedByUser?: {
        id: number;
        username: string;
        firstName?: string | null;
        lastName?: string | null;
    };
}