export interface TokenPayload {
    id: string
    email: string
    role: string
}

export interface ITokenRepository {
    save(token: string, payload: TokenPayload): void
    findByToken(token: string): TokenPayload | undefined
    delete(token: string): void
}
