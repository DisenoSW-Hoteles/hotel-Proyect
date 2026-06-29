import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../../utils/errors/AppError"

export interface AuthRequest extends Request {
    user?: any
}

export const verificarToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(
            new AppError(
                "No estás autenticado. Por favor, inicia sesión.",
                401,
            ),
        )
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secreto_super_seguro_desarrollo",
        )
        req.user = decoded
        next()
    } catch {
        return next(new AppError("Token inválido o expirado.", 401))
    }
}

export const verificarRol = (...rolesPermitidos: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(
                new AppError(
                    "No autenticado. Debes iniciar sesión primero.",
                    401,
                ),
            )
        }

        if (!rolesPermitidos.includes(req.user.role)) {
            return next(
                new AppError(
                    `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(" o ")}.`,
                    403,
                ),
            )
        }

        next()
    }
}
