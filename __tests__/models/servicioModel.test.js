const ServicioModel = require("../../src/models/servicioModel")


// Mock database
jest.mock("../../src/config/db")
const db = require("../../src/config/db")

describe("ServicioModel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    db.query = jest.fn()
  })

  describe("findAll", () => {
    it("should return all services", async () => {
      const mockServicios = [
        {
          id: 1,
          nombre: "Cambio de aceite",
          descripcion: "Cambio completo de aceite",
          precio: 50000,
          estado: "Activo",
        },
        {
          id: 2,
          nombre: "Revisión general",
          descripcion: "Revisión completa del vehículo",
          precio: 80000,
          estado: "Activo",
        },
      ]

      db.query.mockResolvedValue([mockServicios])

      const result = await ServicioModel.findAll()

      expect(db.query).toHaveBeenCalledWith("SELECT * FROM servicio")
      expect(result).toEqual(mockServicios)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Database connection failed"))

      await expect(ServicioModel.findAll()).rejects.toThrow("Database connection failed")
    })
  })

  describe("findById", () => {
    it("should return service by id", async () => {
      const mockServicio = {
        id: 1,
        nombre: "Cambio de aceite",
        descripcion: "Cambio completo de aceite",
        precio: 50000,
        estado: "Activo",
      }

      db.query.mockResolvedValue([[mockServicio]])

      const result = await ServicioModel.findById(1)

      expect(db.query).toHaveBeenCalledWith("SELECT * FROM servicio WHERE id = ?", [1])
      expect(result).toEqual(mockServicio)
    })

    it("should return undefined if service not found", async () => {
      db.query.mockResolvedValue([[]])

      const result = await ServicioModel.findById(999)

      expect(result).toBeUndefined()
    })
  })

  describe("create", () => {
    const mockServicioData = {
      nombre: "Alineación y balanceo",
      descripcion: "Servicio completo de alineación y balanceo",
      precio: 75000,
      estado: "Activo",
    }

    it("should create a new service", async () => {
      const mockInsertId = 5
      db.query.mockResolvedValue([{ insertId: mockInsertId }])

      const result = await ServicioModel.create(mockServicioData)

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)",
        ["Alineación y balanceo", "Servicio completo de alineación y balanceo", 75000, "Activo"],
      )
      expect(result).toBe(mockInsertId)
    })

    it("should create service with default status when not provided", async () => {
      const servicioSinEstado = {
        nombre: "Frenos",
        descripcion: "Cambio de pastillas de freno",
        precio: 120000,
      }

      db.query.mockResolvedValue([{ insertId: 6 }])

      await ServicioModel.create(servicioSinEstado)

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)",
        ["Frenos", "Cambio de pastillas de freno", 120000, "Activo"],
      )
    })

    it("should handle database errors during creation", async () => {
      db.query.mockRejectedValue(new Error("Duplicate entry"))

      await expect(ServicioModel.create(mockServicioData)).rejects.toThrow("Duplicate entry")
    })
  })

  describe("update", () => {
    const updateData = {
      nombre: "Cambio de aceite premium",
      descripcion: "Cambio de aceite sintético premium",
      precio: 85000,
      estado: "Activo",
    }

    it("should update service successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ServicioModel.update(1, updateData)

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE servicio SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id = ?",
        ["Cambio de aceite premium", "Cambio de aceite sintético premium", 85000, "Activo", 1],
      )
    })

    it("should handle update errors", async () => {
      db.query.mockRejectedValue(new Error("Update failed"))

      await expect(ServicioModel.update(1, updateData)).rejects.toThrow("Update failed")
    })
  })

  describe("delete", () => {
    it("should delete service successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ServicioModel.delete(1)

      expect(db.query).toHaveBeenCalledWith("DELETE FROM servicio WHERE id = ?", [1])
    })

    it("should handle delete errors", async () => {
      db.query.mockRejectedValue(new Error("Cannot delete service with dependencies"))

      await expect(ServicioModel.delete(1)).rejects.toThrow("Cannot delete service with dependencies")
    })
  })

  describe("cambiarEstado", () => {
    it("should change service status successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ServicioModel.cambiarEstado(1, "Inactivo")

      expect(db.query).toHaveBeenCalledWith("UPDATE servicio SET estado = ? WHERE id = ?", ["Inactivo", 1])
    })

    it("should handle status change errors", async () => {
      db.query.mockRejectedValue(new Error("Status change failed"))

      await expect(ServicioModel.cambiarEstado(1, "Inactivo")).rejects.toThrow("Status change failed")
    })
  })
})
