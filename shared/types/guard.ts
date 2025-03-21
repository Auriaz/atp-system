export type Access =
    | 'ROLE_USER'
    | 'ROLE_ADMIN'
    | 'ROLE_MODERATOR'
    | 'ROLE_EDITOR'
    | 'ROLE_COACH'
    | 'ROLE_SUPER_ADMIN'

export type ExistsCheck = {
    value: boolean,
    message?: string
}