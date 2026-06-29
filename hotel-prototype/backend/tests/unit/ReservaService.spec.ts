import { ReservaService } from "../../src/services/reservas/ReservaService"
import { AppDataSource } from "../../src/config/database"

const mockQb = {
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
}

let mockFindOne: jest.Mock
let mockCreate: jest.Mock
let mockSave: jest.Mock
let mockUpdate: jest.Mock

const buildRepo = () => ({
  findOne: mockFindOne,
  create: mockCreate,
  save: mockSave,
  update: mockUpdate,
  createQueryBuilder: jest.fn(() => mockQb),
})

jest.mock("../../src/config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}))

describe("ReservaService", () => {
  let service: ReservaService

  beforeEach(() => {
    mockFindOne = jest.fn()
    mockCreate = jest.fn()
    mockSave = jest.fn()
    mockUpdate = jest.fn()
    mockQb.getMany.mockReset()
    mockQb.getOne.mockReset()

    ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(buildRepo())
    service = new ReservaService()
    jest.clearAllMocks()
    ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(buildRepo())
  })

  describe("crearReserva", () => {
    const dto = {
      habitacionId: 1,
      sucursalNombre: "TEMUCO",
      fechaCheckIn: "2026-08-01",
      fechaCheckOut: "2026-08-05",
      cantidadHuespedes: 2,
      huespedNombre: "Juan Perez",
      huespedEmail: "juan@test.cl",
      huespedTelefono: "+56912345678",
      tipoDocumento: "RUT" as const,
      documentoNum: "12345678-9",
    }

    it("debe lanzar AppError si habitacion no existe", async () => {
      mockFindOne.mockResolvedValue(null)

      await expect(service.crearReserva(dto)).rejects.toThrow("La habitación seleccionada no existe.")
    })

    it("debe crear reserva exitosamente", async () => {
      mockFindOne
        .mockResolvedValueOnce({ id: 1, numero: "101", tipo: "ESTANDAR", sucursalId: 1 })
        .mockResolvedValueOnce({ id: 1, nombre: "TEMUCO" })
        .mockResolvedValueOnce(null)

      mockCreate.mockReturnValue({})
      mockSave.mockResolvedValue({ id: "mock-uuid-123", precioTotal: 200000 })

      const result = await service.crearReserva(dto)

      expect(result.huespedNombre).toBe("Juan Perez")
      expect(result.documentoNum).toBe("12345678-9")
      expect(result.precioTotal).toBe(200000)
    })
  })

  describe("buscarPorDocumento", () => {
    it("debe lanzar AppError si documento es inválido", async () => {
      await expect(service.buscarPorDocumento("")).rejects.toThrow("Debe ingresar un RUT o Pasaporte válido")
    })

    it("debe retornar lista vacía si no hay reservas", async () => {
      mockQb.getMany.mockResolvedValue([])

      const result = await service.buscarPorDocumento("12345678-9")
      expect(result).toEqual([])
    })
  })
})
