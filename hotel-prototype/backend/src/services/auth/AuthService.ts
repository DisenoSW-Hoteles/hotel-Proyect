import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { IUserRepository } from "../../interfaces/IUserRepository"
import { ITokenRepository } from "../../interfaces/ITokenRepository"
import { IAuthService, LoginResult } from "../../interfaces/IAuthService"
import { AppError } from "../../utils/errors/AppError"

export class AuthService implements IAuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenRepository: ITokenRepository,
    ) {}

    login(email: string, password: string): LoginResult {
        const SECRET = process.env.JWT_SECRET!
        const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

        const user = this.userRepository.findByEmail(email)
        if (!user) {
            throw new AppError(
                "Credenciales inválidas. Verifique su email y contraseña.",
                401,
            )
        }

        if (!bcrypt.compareSync(password, user.passwordHash)) {
            throw new AppError(
                "Credenciales inválidas. Verifique su email y contraseña.",
                401,
            )
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            branch: user.branch,
        }

        const accessToken = jwt.sign(payload, SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: "7d",
        })

        this.tokenRepository.save(refreshToken, {
            id: user.id,
            email: user.email,
            role: user.role,
        })

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                branch: user.branch,
            },
        }
    }
}
