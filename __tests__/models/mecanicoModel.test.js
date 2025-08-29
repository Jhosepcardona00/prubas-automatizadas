const MecanicoModel = require("../../src/models/mecanicoModel")


// Mock database
jest.mock("../../src/config/db")
const db = require("../../src/config/db")

describe("MecanicoModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.getConnection.mockResolvedValue({
      beginTransaction: jest.fn().mockResolvedValue(),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      query: db.query,
      release: jest.fn().mockResolvedValue(),
    });
  });

  describe("findAll", () => {
    it("should return all mechanics", async () => {
      const mockMecanicos = [
        {
          id: 1,
          nombre: "Juan",
          apellido: "Pérez",
          tipo_documento: "CC",
          documento: "12345678",
          direccion: "Calle 123",
          telefono: "3001234567",
          telefono_emergencia: "3007654321",
          estado: "Activo",
          correo: "juan@test.com",
          rol_id: 3,
        },
      ]

      db.query.mockResolvedValue([mockMecanicos])

      const result = await MecanicoModel.findAll()

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT m.*"))
      expect(result).toEqual(mockMecanicos)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Connection timeout"))

      await expect(MecanicoModel.findAll()).rejects.toThrow("Connection timeout")
    })
  })

  describe("findById", () => {
    it("should return mechanic by id", async () => {
      const mockMecanico = {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        tipo_documento: "CC",
        documento: "12345678",
        estado: "Activo",
      }

      db.query.mockResolvedValue([[mockMecanico]])

      const result = await MecanicoModel.findById(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE m.id = ?"), [1])
      expect(result).toEqual(mockMecanico)
    })

    it("should return undefined if mechanic not found", async () => {
      db.query.mockResolvedValue([[]])

      const result = await MecanicoModel.findById(999)

      expect(result).toBeUndefined()
    })
  })

  describe("findByEstado", () => {
    it("should return mechanics by status", async () => {
      const mockMecanicos = [
        {
          id: 1,
          nombre: "Juan",
          apellido: "Pérez",
          estado: "Activo",
        },
      ]

      db.query.mockResolvedValue([mockMecanicos])

      const result = await MecanicoModel.findByEstado("Activo")

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE m.estado = ?"), ["Activo"])
      expect(result).toEqual(mockMecanicos)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(MecanicoModel.findByEstado("Activo")).rejects.toThrow("Database error")
    })
  })

  describe("create", () => {
    const mockMecanicoData = {
      nombre: "Ana",
      apellido: "García",
      tipo_documento: "CC",
      documento: "87654321",
      direccion: "Carrera 456",
      telefono: "3009876543",
      telefono_emergencia: "3001234567",
      correo: "ana@test.com",
      estado: "Activo",
      password: "password123",
    }

    it("should create a new mechanic", async () => {
      const mockInsertId = 5
      db.query.mockResolvedValue([{ insertId: mockInsertId }])

      const result = await MecanicoModel.create(mockMecanicoData)

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO mecanico"),
        expect.arrayContaining([
          "Ana",
          "García",
          "CC",
          "87654321",
          "Carrera 456",
          "3009876543",
          "3001234567",
          expect.any(String), // correo
          "Activo"
        ])
      )
      expect(result).toBe(mockInsertId)
    })

    it("should create mechanic with default status when not provided", async () => {
      const mecanicoSinEstado = {
        nombre: "Luis",
        apellido: "Martínez",
        tipo_documento: "CC",
        documento: "11111111",
        direccion: "Avenida 789",
        telefono: "3005555555",
        telefono_emergencia: "3002222222",
        correo: "luis@test.com",
        password: "password456",
      }

      db.query.mockResolvedValue([{ insertId: 6 }])

      await MecanicoModel.create(mecanicoSinEstado)

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO mecanico"),
        expect.arrayContaining(["Activo"]),
      )
    })

    it("should handle creation errors", async () => {
      db.query.mockRejectedValue(new Error("Duplicate document"))

      await expect(MecanicoModel.create(mockMecanicoData)).rejects.toThrow("Duplicate document")
    })
  })

  describe("update", () => {
    const updateData = {
      nombre: "Ana Updated",
      apellido: "García Updated",
      tipo_documento: "CC",
      documento: "87654321",
      direccion: "Nueva Carrera 456",
      telefono: "3001111111",
      telefono_emergencia: "3002222222",
      correo: "ana.updated@test.com",
      estado: "Activo",
    }

    it("should update mechanic successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await MecanicoModel.update(1, updateData)

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE mecanico"),
        expect.arrayContaining([
          "Ana Updated",
          "García Updated",
          "CC",
          "87654321",
          "Nueva Carrera 456",
          "3001111111",
          "3002222222",
          expect.any(String), // correo
          "Activo",
          1
        ])
      )
    })

    it("should handle update errors", async () => {
      db.query.mockRejectedValue(new Error("Update constraint violation"))

      await expect(MecanicoModel.update(1, updateData)).rejects.toThrow("Update constraint violation")
    })
  })

  describe("delete", () => {
    it("should delete mechanic successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await MecanicoModel.delete(1)

      expect(db.query).toHaveBeenCalledWith("DELETE FROM mecanico WHERE id = ?", [1])
    })

    it("should handle delete errors", async () => {
      db.query.mockRejectedValue(new Error("Cannot delete mechanic with appointments"))

      await expect(MecanicoModel.delete(1)).rejects.toThrow("Cannot delete mechanic with appointments")
    })
  })

  describe("cambiarEstado", () => {
    it("should change mechanic status successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await MecanicoModel.cambiarEstado(1, "Inactivo")

      expect(db.query).toHaveBeenCalledWith("UPDATE mecanico SET estado = ? WHERE id = ?", ["Inactivo", 1])
    })

    it("should handle status change errors", async () => {
      db.query.mockRejectedValue(new Error("Status change failed"))

      await expect(MecanicoModel.cambiarEstado(1, "Inactivo")).rejects.toThrow("Status change failed")
    })
  })

  describe("getCitasByMecanico", () => {
    it("should return appointments for mechanic", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          estado_nombre: "Pendiente",
          vehiculo_placa: "ABC123",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await MecanicoModel.getCitasByMecanico(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.mecanico_id = ?"), [1])
      expect(result).toEqual(mockCitas)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(MecanicoModel.getCitasByMecanico(1)).rejects.toThrow("Database error")
    })
  })

  describe("getEstadisticasByMecanico", () => {
    it("should return mechanic statistics", async () => {
      const mockStats = {
        total_citas: 10,
        citas_completadas: 7,
        citas_pendientes: 2,
        citas_canceladas: 1,
      }

      db.query.mockResolvedValue([[mockStats]])

      const result = await MecanicoModel.getEstadisticasByMecanico(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.mecanico_id = ?"), [1])
      expect(result).toEqual(mockStats)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(MecanicoModel.getEstadisticasByMecanico(1)).rejects.toThrow("Database error")
    })
  })
})
