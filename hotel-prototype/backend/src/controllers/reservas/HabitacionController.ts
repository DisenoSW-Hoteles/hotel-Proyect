import { Request, Response, NextFunction } from "express"
import { IHabitacionService } from "../../interfaces/IHabitacionService"
import { ConsultaDisponibilidadDTO } from "../../models/dtos/Habitacion.dto"

export class HabitacionController {
    constructor(
        private readonly habitacionService: IHabitacionService,
    ) {}

    /**
     * @swagger
     * /api/habitaciones/disponibilidad:
     *   post:
     *     summary: Busca habitaciones disponibles por fecha y sucursal
     *     tags: [Habitaciones]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               fechaCheckIn:
     *                 type: string
     *                 example: "2026-06-10"
     *               fechaCheckOut:
     *                 type: string
     *                 example: "2026-06-15"
     *               cantidadHuespedes:
     *                 type: integer
     *                 example: 2
     *               sucursalNombre:
     *                 type: string
     *                 example: "Temuco"
     *     responses:
     *       200:
     *         description: Lista de habitaciones disponibles
     *       400:
     *         description: Error de reglas de negocio
     */
    async buscarDisponibilidad(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const consulta: ConsultaDisponibilidadDTO = req.body

            const disponibles =
                await this.habitacionService.obtenerHabitacionesDisponibles(
                    consulta,
                )

            res.status(200).json({
                status: "success",
                results: disponibles.length,
                data: disponibles,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * /api/admin/rooms:
     *   get:
     *     summary: Obtiene el catálogo completo de habitaciones
     *     tags: [Habitaciones]
     *     responses:
     *       200:
     *         description: Lista completa de habitaciones para el panel administrativo
     */
    async obtenerTodas(req: Request, res: Response, next: NextFunction) {
        try {
            const habitaciones = await this.habitacionService.obtenerTodas()

            res.status(200).json(habitaciones)
        } catch (error) {
            next(error)
        }
    }
}
