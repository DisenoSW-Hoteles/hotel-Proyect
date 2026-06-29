import { ReservaValidation } from "../../src/services/reservas/ReservaValidation"
import { AppError } from "../../src/utils/errors/AppError"

describe("ReservaValidation", () => {
  describe("validarCrearReserva", () => {
    const validaDto = {
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

    it("debe pasar con datos válidos", () => {
      expect(() => ReservaValidation.validarCrearReserva(validaDto)).not.toThrow()
    })

    it("debe lanzar AppError si habitacionId es inválido", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, habitacionId: 0 })).toThrow(AppError)
    })

    it("debe lanzar AppError si sucursalNombre está vacío", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, sucursalNombre: "" })).toThrow(AppError)
    })

    it("debe lanzar AppError si huespedNombre es muy corto", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, huespedNombre: "A" })).toThrow(AppError)
    })

    it("debe lanzar AppError si documentoNum es muy corto", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, documentoNum: "12" })).toThrow(AppError)
    })

    it("debe lanzar AppError si tipoDocumento no es RUT o PASAPORTE", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, tipoDocumento: "DNI" as any })).toThrow(AppError)
    })

    it("debe lanzar AppError si fechaCheckOut <= fechaCheckIn", () => {
      expect(() =>
        ReservaValidation.validarCrearReserva({
          ...validaDto,
          fechaCheckIn: "2026-08-05",
          fechaCheckOut: "2026-08-01",
        })
      ).toThrow(AppError)
    })

    it("debe lanzar AppError si cantidadHuespedes < 1", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, cantidadHuespedes: 0 })).toThrow(AppError)
    })

    it("debe lanzar AppError si fechaCheckIn es inválida", () => {
      expect(() => ReservaValidation.validarCrearReserva({ ...validaDto, fechaCheckIn: "no-es-fecha" })).toThrow(AppError)
    })
  })

  describe("validarDocumento", () => {
    it("debe pasar con documento válido", () => {
      expect(() => ReservaValidation.validarDocumento("12345678-9")).not.toThrow()
    })

    it("debe lanzar AppError si documento está vacío", () => {
      expect(() => ReservaValidation.validarDocumento("")).toThrow(AppError)
    })

    it("debe lanzar AppError si documento es muy corto", () => {
      expect(() => ReservaValidation.validarDocumento("AB")).toThrow(AppError)
    })
  })
})
