import { ITokenRepository, TokenPayload } from "../interfaces/ITokenRepository"

export class InMemoryTokenRepository implements ITokenRepository {
    private readonly store: Map<string, TokenPayload> = new Map()

    save(token: string, payload: TokenPayload): void {
        this.store.set(token, { ...payload })
    }

    findByToken(token: string): TokenPayload | undefined {
        return this.store.get(token)
    }

    delete(token: string): void {
        this.store.delete(token)
    }
}
