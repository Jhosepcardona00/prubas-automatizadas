const VehiculoModel = require("../../src/models/vehiculoModel")


// Mock database
jest.mock("../../src/config/db")
const db = require("../../src/config/db")

describe("VehiculoModel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    db.query = jest.fn()
  })

  describe("findAll", () => {
    it("should return all vehicles with related data", async () => {
      const mockVehiculos = [
        {
          id: 1,
          placa: "ABC123",
          color: "Rojo",
          tipo_vehiculo: "Automóvil",
          referencia_nombre: "Corolla",
          marca_nombre: "Toyota",
          cliente_nombre: "Juan",
          cliente_apellido: "Pérez",
        },
      ]

      db.query.mockResolvedValue([mockVehiculos])

      const result = await VehiculoModel.findAll()

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT v.*"))
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("JOIN referencia r"))
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("JOIN marca m"))
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("JOIN cliente c"))
      expect(result).toEqual(mockVehiculos)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database error"))

      await expect(VehiculoModel.findAll()).rejects.toThrow("Database error")
    })
  })

  describe("findById", () => {
    it("should return vehicle by id with related data", async () => {
      const mockVehiculo = {
        id: 1,
        placa: "ABC123",
        color: "Rojo",
        referencia_nombre: "Corolla",
        marca_nombre: "Toyota",
        cliente_nombre: "Juan",
        cliente_apellido: "Pérez",
      }

      db.query.mockResolvedValue([[mockVehiculo]])

      const result = await VehiculoModel.findById(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.id = ?"), [1])
      expect(result).toEqual(mockVehiculo)
    })

    it("should return undefined if vehicle not found", async () => {
      db.query.mockResolvedValue([[]])

      const result = await VehiculoModel.findById(999)

      expect(result).toBeUndefined()
    })
  })

  describe("findByCliente", () => {
    it("should return vehicles by client id", async () => {
      const mockVehiculos = [
        {
          id: 1,
          placa: "ABC123",
          referencia_nombre: "Corolla",
          marca_nombre: "Toyota",
        },
        {
          id: 2,
          placa: "DEF456",
          referencia_nombre: "Civic",
          marca_nombre: "Honda",
        },
      ]

      db.query.mockResolvedValue([mockVehiculos])

      const result = await VehiculoModel.findByCliente(1)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.cliente_id = ?"), [1])
      expect(result).toEqual(mockVehiculos)
    })
  })

  describe("create", () => {
    const mockVehiculoData = {
      placa: "XYZ789",
      color: "Azul",
      tipo_vehiculo: "SUV",
      referencia_id: 5,
      cliente_id: 3,
      estado: "Activo",
    }

    it("should create a new vehicle", async () => {
      const mockInsertId = 10
      db.query.mockResolvedValue([{ insertId: mockInsertId }])

      const result = await VehiculoModel.create(mockVehiculoData)

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO vehiculo (placa, color, tipo_vehiculo, referencia_id, cliente_id, estado) VALUES (?, ?, ?, ?, ?, ?)",
        ["XYZ789", "Azul", "SUV", 5, 3, "Activo"],
      )
      expect(result).toBe(mockInsertId)
    })

    it("should create vehicle with default status when not provided", async () => {
      const vehiculoSinEstado = {
        placa: "GHI012",
        color: "Verde",
        tipo_vehiculo: "Motocicleta",
        referencia_id: 8,
        cliente_id: 2,
      }

      db.query.mockResolvedValue([{ insertId: 11 }])

      await VehiculoModel.create(vehiculoSinEstado)

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO vehiculo (placa, color, tipo_vehiculo, referencia_id, cliente_id, estado) VALUES (?, ?, ?, ?, ?, ?)",
        ["GHI012", "Verde", "Motocicleta", 8, 2, "Activo"],
      )
    })

    it("should handle creation errors", async () => {
      db.query.mockRejectedValue(new Error("Duplicate plate number"))

      await expect(VehiculoModel.create(mockVehiculoData)).rejects.toThrow("Duplicate plate number")
    })
  })

  describe("update", () => {
    const updateData = {
      placa: "XYZ999",
      color: "Negro",
      tipo_vehiculo: "Camioneta",
      referencia_id: 6,
      cliente_id: 4,
      estado: "Activo",
    }

    it("should update vehicle successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await VehiculoModel.update(1, updateData)

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE vehiculo SET placa = ?, color = ?, tipo_vehiculo = ?, referencia_id = ?, cliente_id = ?, estado = ? WHERE id = ?",
        ["XYZ999", "Negro", "Camioneta", 6, 4, "Activo", 1],
      )
    })

    it("should handle update errors", async () => {
      db.query.mockRejectedValue(new Error("Update failed"))

      await expect(VehiculoModel.update(1, updateData)).rejects.toThrow("Update failed")
    })
  })

  describe("delete", () => {
    it("should delete vehicle successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await VehiculoModel.delete(1)

      expect(db.query).toHaveBeenCalledWith("DELETE FROM vehiculo WHERE id = ?", [1])
    })

    it("should handle delete errors", async () => {
      db.query.mockRejectedValue(new Error("Cannot delete vehicle with appointments"))

      await expect(VehiculoModel.delete(1)).rejects.toThrow("Cannot delete vehicle with appointments")
    })
  })

  describe("cambiarEstado", () => {
    it("should change vehicle status successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await VehiculoModel.cambiarEstado(1, "Inactivo")

      expect(db.query).toHaveBeenCalledWith("UPDATE vehiculo SET estado = ? WHERE id = ?", ["Inactivo", 1])
    })

    it("should handle status change errors", async () => {
      db.query.mockRejectedValue(new Error("Status change failed"))

      await expect(VehiculoModel.cambiarEstado(1, "Inactivo")).rejects.toThrow("Status change failed")
    })
  })
})
