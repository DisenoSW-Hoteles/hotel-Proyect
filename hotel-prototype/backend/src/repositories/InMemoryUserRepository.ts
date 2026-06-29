import bcrypt from "bcryptjs"
import { IUser, IUserRepository } from "../interfaces/IUserRepository"

export class InMemoryUserRepository implements IUserRepository {
    private readonly users: IUser[]

    constructor() {
        this.users = [
            {
                id: "1",
                email: "admin@hotel.cl",
                passwordHash: bcrypt.hashSync("admin123", 10),
                fullName: "Administrador Principal",
                role: "SUPER_ADMIN",
                branch: "TEMUCO",
            },
            {
                id: "2",
                email: "bxrbara@gmail.com",
                passwordHash: bcrypt.hashSync("123456", 10),
                fullName: "Bárbara González",
                role: "SUPER_ADMIN",
                branch: "TEMUCO",
            },
        ]
    }

    findByEmail(email: string): IUser | undefined {
        return this.users.find((u) => u.email === email)
    }
}
