export interface LoginResult {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
        fullName: string
        role: string
        branch: string
    }
}

export interface IAuthService {
    login(email: string, password: string): LoginResult
}
