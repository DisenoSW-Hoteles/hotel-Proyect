export interface IUser {
    id: string
    email: string
    passwordHash: string
    fullName: string
    role: string
    branch: string
}

export interface IUserRepository {
    findByEmail(email: string): IUser | undefined
}
