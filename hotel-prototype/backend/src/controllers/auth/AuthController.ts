import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../../utils/errors/AppError"
import { IAuthService } from "../../interfaces/IAuthService"
import { ITokenRepository } from "../../interfaces/ITokenRepository"

const SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export class AuthController {
    constructor(
        private readonly authService: IAuthService,
        private readonly tokenRepository: ITokenRepository,
    ) {}

    login(req: Request, res: Response, next: NextFunction): void {
        const { email, password } = req.body

        try {
            const result = this.authService.login(email, password)
            res.status(200).json({
                access_token: result.accessToken,
                refresh_token: result.refreshToken,
                token_type: "Bearer",
                expires_in: 900,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    full_name: result.user.fullName,
                    role: result.user.role,
                    branch: result.user.branch,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    refresh(req: Request, res: Response, next: NextFunction): void {
        const { refresh_token } = req.body

        if (!refresh_token) {
            return next(new AppError("Refresh token requerido.", 400))
        }

        const userData = this.tokenRepository.findByToken(refresh_token)
        if (!userData) {
            return next(
                new AppError("Refresh token inválido o expirado.", 401),
            )
        }

        try {
            jwt.verify(refresh_token, REFRESH_SECRET)
        } catch {
            this.tokenRepository.delete(refresh_token)
            return next(new AppError("Refresh token expirado.", 401))
        }

        this.tokenRepository.delete(refresh_token)

        const payload = { ...userData, branch: "TEMUCO" as const }
        const newAccessToken = jwt.sign(payload, SECRET, { expiresIn: "15m" })
        const newRefreshToken = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: "7d",
        })

        this.tokenRepository.save(newRefreshToken, {
            id: userData.id,
            email: userData.email,
            role: userData.role,
        })

        res.status(200).json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            token_type: "Bearer",
            expires_in: 900,
        })
    }

    logout(req: Request, res: Response, next: NextFunction): void {
        const { refresh_token } = req.body
        if (refresh_token) {
            this.tokenRepository.delete(refresh_token)
        }
        res.status(200).json({ message: "Sesión cerrada exitosamente." })
    }
}
