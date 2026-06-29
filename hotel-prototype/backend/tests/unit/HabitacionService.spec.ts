import { HabitacionService } from "../../src/services/reservas/HabitacionService"
import { HabitacionRepository } from "../../src/repositories/reservas/HabitacionRepository"
import { AppError } from "../../src/utils/errors/AppError"

jest.mock("../../src/repositories/reservas/HabitacionRepository", () => ({
    HabitacionRepository: {
        buscarDisponibles: jest.fn(),
        buscarTodas: jest.fn(),
    },
}))

describe("HabitacionService", () => {
    let service: HabitacionService

    beforeEach(() => {
        service = new HabitacionService()
        jest.clearAllMocks()
    })

    describe("obtenerHabitacionesDisponibles", () => {
        it("debe lanzar AppError 400 si sucursalNombre está vacío", async () => {
            const consulta = {
                fechaCheckIn: "2026-07-01",
                fechaCheckOut: "2026-07-05",
                cantidadHuespedes: 2,
                sucursalNombre: "",
            }

            await expect(
                service.obtenerHabitacionesDisponibles(consulta),
            ).rejects.toBeInstanceOf(AppError)

            expect(
                HabitacionRepository.buscarDisponibles,
            ).not.toHaveBeenCalled()
        })

        it("debe retornar habitaciones mapeadas correctamente", async () => {
            const mockHabitaciones = [
                {
                    id: 1,
                    numero: "101",
                    tipo: "ESTANDAR",
                    capacidadMaxima: 2,
                    sucursalId: 1,
                },
                {
                    id: 2,
                    numero: "201",
                    tipo: "SUITE_EJECUTIVA",
                    capacidadMaxima: 4,
                    sucursalId: 1,
                },
            ]

            ;(
                HabitacionRepository.buscarDisponibles as jest.Mock
            ).mockResolvedValue(mockHabitaciones)

            const consulta = {
                fechaCheckIn: "2026-07-01",
                fechaCheckOut: "2026-07-05",
                cantidadHuespedes: 2,
                sucursalNombre: "TEMUCO",
            }

            const resultado =
                await service.obtenerHabitacionesDisponibles(consulta)

            expect(resultado).toHaveLength(2)
            expect(resultado[0].tipoHabitacion).toBe("Estandar")
            expect(resultado[1].tipoHabitacion).toBe("SuiteEjecutiva")
            expect(
                HabitacionRepository.buscarDisponibles,
            ).toHaveBeenCalledTimes(1)
        })
    })

    describe("obtenerTodas", () => {
        it("debe usar Estandar como fallback para tipo desconocido", async () => {
            const mockHabitaciones = [
                {
                    id: 1,
                    numero: "301",
                    tipo: "VIP",
                    capacidadMaxima: 2,
                    sucursalId: 1,
                },
            ]

            ;(
                HabitacionRepository.buscarTodas as jest.Mock
            ).mockResolvedValue(mockHabitaciones)

            const resultado = await service.obtenerTodas()

            expect(resultado[0].tipoHabitacion).toBe("Estandar")
        })

        it("debe retornar todas las habitaciones con precio por defecto", async () => {
            const mockHabitaciones = [
                {
                    id: 1,
                    numero: "101",
                    tipo: "PLUS",
                    capacidadMaxima: 3,
                    sucursalId: 1,
                },
            ]

            ;(HabitacionRepository.buscarTodas as jest.Mock).mockResolvedValue(
                mockHabitaciones,
            )

            const resultado = await service.obtenerTodas()

            expect(resultado).toHaveLength(1)
            expect(resultado[0].precioPorNoche).toBe(50000)
            expect(resultado[0].descripcionBreve).toContain("101")
        })
    })
})
