import jwt from "jsonwebtoken"
import {
    verificarToken,
    verificarRol,
    AuthRequest,
} from "../../src/middleware/auth/authMiddleware"
import { AppError } from "../../src/utils/errors/AppError"
import { Response, NextFunction } from "express"

const SECRET =
    process.env.JWT_SECRET || "secreto_super_seguro_desarrollo"

describe("authMiddleware - verificarToken", () => {
    let mockReq: Partial<AuthRequest>
    let mockRes: Partial<Response>
    let mockNext: jest.Mock

    beforeEach(() => {
        mockReq = { headers: {} }
        mockRes = {}
        mockNext = jest.fn()
    })

    it("debe rechazar 401 si no hay header Authorization", () => {
        verificarToken(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError))
        expect(mockNext.mock.calls[0][0].statusCode).toBe(401)
    })

    it("debe rechazar 401 si el token es inválido", () => {
        mockReq.headers = { authorization: "Bearer token_invalido" }

        verificarToken(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError))
        expect(mockNext.mock.calls[0][0].statusCode).toBe(401)
    })

    it("debe aceptar y asignar req.user si el token es válido", () => {
        const token = jwt.sign(
            { id: "1", role: "ADMIN" },
            SECRET,
        )
        mockReq.headers = { authorization: `Bearer ${token}` }

        verificarToken(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith()
        expect(mockReq.user).toBeDefined()
        expect(mockReq.user!.role).toBe("ADMIN")
    })
})

describe("authMiddleware - verificarRol", () => {
    let mockReq: Partial<AuthRequest>
    let mockRes: Partial<Response>
    let mockNext: jest.Mock

    beforeEach(() => {
        mockReq = {}
        mockRes = {}
        mockNext = jest.fn()
    })

    it("debe rechazar 401 si no hay user en la request", () => {
        const middleware = verificarRol("ADMIN")

        middleware(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError))
        expect(mockNext.mock.calls[0][0].statusCode).toBe(401)
    })

    it("debe rechazar 403 si el rol no está permitido", () => {
        mockReq.user = { role: "RECEPCION" }
        const middleware = verificarRol("SUPER_ADMIN", "ADMIN")

        middleware(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith(expect.any(AppError))
        expect(mockNext.mock.calls[0][0].statusCode).toBe(403)
    })

    it("debe aceptar si el rol está en la lista permitida", () => {
        mockReq.user = { role: "ADMIN" }
        const middleware = verificarRol("SUPER_ADMIN", "ADMIN")

        middleware(
            mockReq as AuthRequest,
            mockRes as Response,
            mockNext as NextFunction,
        )

        expect(mockNext).toHaveBeenCalledWith()
    })
})
