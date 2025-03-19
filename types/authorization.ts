export interface IAuthLoginBody {
    email: string
    password: string
}

export interface IAuthRegisterBody {
    email: string
    username: string
    password: string
    password_confirmation: string
    isAgree: boolean
}

export interface IOAuthParams {
    id: number
    email: string
    username: string
    avatarUrl?: string
    provider: string
    providerAccountId: string | number
    accessToken: string
}