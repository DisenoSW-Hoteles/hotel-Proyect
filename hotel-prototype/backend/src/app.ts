import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

import { AppError } from "./utils/errors/AppError"
import { errorHandler } from "./middleware/error/errorHandler"
import { verificarToken, verificarRol } from "./middleware/auth/authMiddleware"
import { HabitacionController } from "./controllers/reservas/HabitacionController"
import { AuthController } from "./controllers/auth/AuthController"
import { InMemoryTokenRepository } from "./repositories/InMemoryTokenRepository"
import { InMemoryUserRepository } from "./repositories/InMemoryUserRepository"
import { AuthService } from "./services/auth/AuthService"
import { HabitacionService } from "./services/reservas/HabitacionService"
import { ReservaService } from "./services/reservas/ReservaService"
import { ReservaController } from "./controllers/reservas/ReservaController"
import healthRoutes from "./routes/healthRoutes"

export const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: { title: "Hotel API", version: "1.0.0" },
    },
    apis: ["./src/controllers/**/*.ts", "./src/routes/**/*.ts"],
}
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(swaggerOptions)),
)

const tokenRepository = new InMemoryTokenRepository()
const userRepository = new InMemoryUserRepository()
const authService = new AuthService(userRepository, tokenRepository)
const habitacionService = new HabitacionService()
const habitacionCtrl = new HabitacionController(habitacionService)
const authCtrl = new AuthController(authService, tokenRepository)
const reservaService = new ReservaService()
const reservaCtrl = new ReservaController(reservaService)

app.use("/api", healthRoutes)

app.get(
    "/api/admin/rooms",
    verificarToken,
    verificarRol("SUPER_ADMIN", "ADMIN"),
    (req, res, next) => habitacionCtrl.obtenerTodas(req, res, next),
)

app.post(
    "/api/habitaciones/disponibilidad",
    (req, res, next) => habitacionCtrl.buscarDisponibilidad(req, res, next),
)

app.post("/api/auth/login", (req, res, next) =>
    authCtrl.login(req, res, next),
)

app.post("/api/auth/refresh", (req, res, next) =>
    authCtrl.refresh(req, res, next),
)

app.post("/api/auth/logout", (req, res, next) =>
    authCtrl.logout(req, res, next),
)

app.post("/api/reservas",
    (req, res, next) => reservaCtrl.crearReserva(req, res, next),
)

app.get("/api/admin/reservations/by-guest/:documento",
    verificarToken,
    (req, res, next) => reservaCtrl.buscarPorDocumento(req, res, next),
)

app.get("/api/admin/reservations/by-code/:id",
    verificarToken,
    (req, res, next) => reservaCtrl.buscarPorId(req, res, next),
)

app.all("*", (req: Request, _res: Response, next: NextFunction) => {
    next(
        new AppError(
            `No se puede encontrar la ruta ${req.originalUrl} en este servidor.`,
            404,
        ),
    )
})

app.use(errorHandler)
