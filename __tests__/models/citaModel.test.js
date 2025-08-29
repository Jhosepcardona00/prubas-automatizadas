const CitaModel = require("../../src/models/citaModel")


// Mock database
jest.mock("../../src/config/db")
const db = require("../../src/config/db")

describe("CitaModel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("findAll", () => {
    it("should return all citas with joined data", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          observaciones: "Revisión general",
          estado_nombre: "Programada",
          vehiculo_placa: "ABC123",
          cliente_nombre: "Juan",
          cliente_apellido: "Pérez",
          mecanico_nombre: "Carlos",
          mecanico_apellido: "García",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await CitaModel.findAll()

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT c.*"))
      expect(result).toEqual(mockCitas)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.findAll()).rejects.toThrow("Database error")
    })
  })

  describe("findById", () => {
    it("should return a cita by id", async () => {
      const mockCita = {
        id: 1,
        fecha: "2024-01-15",
        hora: "10:00:00",
        observaciones: "Revisión general",
        estado_nombre: "Programada",
        vehiculo_placa: "ABC123",
        cliente_nombre: "Juan",
        cliente_apellido: "Pérez",
      }

      db.query.mockResolvedValue([[mockCita]])

      const result = await CitaModel.findById(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.id = ?"), [1])
      expect(result).toEqual(mockCita)
    })

    it("should return undefined if cita not found", async () => {
      db.query.mockResolvedValue([[]])

      const result = await CitaModel.findById(999)

      expect(result).toBeUndefined()
    })
  })

  describe("findByCliente", () => {
    it("should return citas for a specific cliente", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          vehiculo_placa: "ABC123",
          estado_nombre: "Programada",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await CitaModel.findByCliente(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.cliente_id = ?"), [1])
      expect(result).toEqual(mockCitas)
    })
  })

  describe("findByMecanico", () => {
    it("should return citas for a specific mecanico", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          vehiculo_placa: "ABC123",
          estado_nombre: "Programada",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await CitaModel.findByMecanico(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.mecanico_id = ?"), [1])
      expect(result).toEqual(mockCitas)
    })
  })

  describe("findByFecha", () => {
    it("should return citas for a specific date", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          vehiculo_placa: "ABC123",
          estado_nombre: "Programada",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await CitaModel.findByFecha("2024-01-15")

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.fecha = ?"), ["2024-01-15"])
      expect(result).toEqual(mockCitas)
    })
  })

  describe("findByEstado", () => {
    it("should return citas for a specific estado", async () => {
      const mockCitas = [
        {
          id: 1,
          fecha: "2024-01-15",
          hora: "10:00:00",
          vehiculo_placa: "ABC123",
          estado_nombre: "Programada",
        },
      ]

      db.query.mockResolvedValue([mockCitas])

      const result = await CitaModel.findByEstado(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE c.estado_cita_id = ?"), [1])
      expect(result).toEqual(mockCitas)
    })
  })

  describe("create", () => {
    it("should create a new cita and return insertId", async () => {
      const citaData = {
        fecha: "2024-01-15",
        hora: "10:00:00",
        observaciones: "Revisión general",
        estado_cita_id: 1,
        vehiculo_id: 1,
        mecanico_id: 1,
      }

      const mockResult = { insertId: 1 }
      db.query.mockResolvedValue([mockResult])

      const result = await CitaModel.create(citaData)

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO cita (fecha, hora, observaciones, estado_cita_id, vehiculo_id, mecanico_id) VALUES (?, ?, ?, ?, ?, ?)",
        [
          citaData.fecha,
          citaData.hora,
          citaData.observaciones,
          citaData.estado_cita_id,
          citaData.vehiculo_id,
          citaData.mecanico_id,
        ],
      )
      expect(result).toBe(1)
    })

    it("should handle database errors during creation", async () => {
      const citaData = {
        fecha: "2024-01-15",
        hora: "10:00:00",
        observaciones: "Revisión general",
        estado_cita_id: 1,
        vehiculo_id: 1,
        mecanico_id: 1,
      }

      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.create(citaData)).rejects.toThrow("Database error")
    })
  })

  describe("update", () => {
    it("should update a cita", async () => {
      const citaData = {
        fecha: "2024-01-16",
        hora: "11:00:00",
        observaciones: "Revisión actualizada",
        estado_cita_id: 2,
        vehiculo_id: 1,
        mecanico_id: 2,
      }

      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await CitaModel.update(1, citaData)

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE cita SET fecha = ?, hora = ?, observaciones = ?, estado_cita_id = ?, vehiculo_id = ?, mecanico_id = ? WHERE id = ?",
        [
          citaData.fecha,
          citaData.hora,
          citaData.observaciones,
          citaData.estado_cita_id,
          citaData.vehiculo_id,
          citaData.mecanico_id,
          1,
        ],
      )
    })

    it("should handle database errors during update", async () => {
      const citaData = {
        fecha: "2024-01-16",
        hora: "11:00:00",
        observaciones: "Revisión actualizada",
        estado_cita_id: 2,
        vehiculo_id: 1,
        mecanico_id: 2,
      }

      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.update(1, citaData)).rejects.toThrow("Database error")
    })
  })

  describe("delete", () => {
    it("should delete a cita", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await CitaModel.delete(1)

      expect(db.query).toHaveBeenCalledWith("DELETE FROM cita WHERE id = ?", [1])
    })

    it("should handle database errors during deletion", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.delete(1)).rejects.toThrow("Database error")
    })
  })

  describe("cambiarEstado", () => {
    it("should change cita estado", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await CitaModel.cambiarEstado(1, 2)

      expect(db.query).toHaveBeenCalledWith("UPDATE cita SET estado_cita_id = ? WHERE id = ?", [2, 1])
    })

    it("should handle database errors during estado change", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.cambiarEstado(1, 2)).rejects.toThrow("Database error")
    })
  })

  describe("verificarDisponibilidadMecanico", () => {
    it("should return true when mecanico is available", async () => {
      db.query.mockResolvedValue([[{ total: 0 }]])

      const result = await CitaModel.verificarDisponibilidadMecanico(1, "2024-01-15", "10:00:00")

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT COUNT(*) as total"), [
        1,
        "2024-01-15",
        "10:00:00",
      ])
      expect(result).toBe(true)
    })

    it("should return false when mecanico is not available", async () => {
      db.query.mockResolvedValue([[{ total: 1 }]])

      const result = await CitaModel.verificarDisponibilidadMecanico(1, "2024-01-15", "10:00:00")

      expect(result).toBe(false)
    })

    it("should exclude current cita when updating", async () => {
      db.query.mockResolvedValue([[{ total: 0 }]])

      const result = await CitaModel.verificarDisponibilidadMecanico(1, "2024-01-15", "10:00:00", 5)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("AND id != ?"), [1, "2024-01-15", "10:00:00", 5])
      expect(result).toBe(true)
    })

    it("should handle database errors during availability check", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(CitaModel.verificarDisponibilidadMecanico(1, "2024-01-15", "10:00:00")).rejects.toThrow(
        "Database error",
      )
    })
  })
})
