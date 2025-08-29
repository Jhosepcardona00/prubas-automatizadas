const ProveedorModel = require("../../src/models/proveedorModel")

// Mock database

jest.mock("../../src/config/db")
const db = require("../../src/config/db")

describe("ProveedorModel", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    db.query = jest.fn()
  })

  describe("findAll", () => {
    it("should return all suppliers", async () => {
      const mockProveedores = [
        {
          id: 1,
          nombre: "Carlos Rodríguez",
          telefono: "3001234567",
          nombre_empresa: "Repuestos del Norte",
          nit: "900123456-1",
          direccion: "Calle 50 #25-30",
          estado: "Activo",
          correo: "carlos@repuestosnorte.com",
          telefono_empresa: "6012345678",
        },
      ]

      db.query.mockResolvedValue([mockProveedores])

      const result = await ProveedorModel.findAll()

      expect(db.query).toHaveBeenCalledWith("SELECT * FROM proveedor")
      expect(result).toEqual(mockProveedores)
    })

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("Connection timeout"))

      await expect(ProveedorModel.findAll()).rejects.toThrow("Connection timeout")
    })
  })

  describe("findById", () => {
    it("should return supplier by id", async () => {
      const mockProveedor = {
        id: 1,
        nombre: "Carlos Rodríguez",
        telefono: "3001234567",
        nombre_empresa: "Repuestos del Norte",
        nit: "900123456-1",
        estado: "Activo",
      }

      db.query.mockResolvedValue([[mockProveedor]])

      const result = await ProveedorModel.findById(1)

      expect(db.query).toHaveBeenCalledWith("SELECT * FROM proveedor WHERE id = ?", [1])
      expect(result).toEqual(mockProveedor)
    })

    it("should return undefined if supplier not found", async () => {
      db.query.mockResolvedValue([[]])

      const result = await ProveedorModel.findById(999)

      expect(result).toBeUndefined()
    })
  })

  describe("create", () => {
    const mockProveedorData = {
      nombre: "Ana García",
      telefono: "3009876543",
      nombre_empresa: "Autopartes del Sur",
      nit: "800987654-2",
      direccion: "Carrera 15 #40-20",
      estado: "Activo",
      correo: "ana@autopartessur.com",
      telefono_empresa: "6019876543",
    }

    it("should create a new supplier", async () => {
      const mockInsertId = 5
      db.query.mockResolvedValue([{ insertId: mockInsertId }])

      const result = await ProveedorModel.create(mockProveedorData)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO proveedor"), [
        "Ana García",
        "3009876543",
        "Autopartes del Sur",
        "800987654-2",
        "Carrera 15 #40-20",
        "Activo",
        "ana@autopartessur.com",
        "6019876543",
      ])
      expect(result).toBe(mockInsertId)
    })

    it("should create supplier with default status when not provided", async () => {
      const proveedorSinEstado = {
        nombre: "Luis Martínez",
        telefono: "3005555555",
        nombre_empresa: "Repuestos Express",
        nit: "700555555-3",
        direccion: "Avenida 80 #30-15",
        correo: "luis@repuestosexpress.com",
        telefono_empresa: "6015555555",
      }

      db.query.mockResolvedValue([{ insertId: 6 }])

      await ProveedorModel.create(proveedorSinEstado)

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO proveedor"),
        expect.arrayContaining(["Activo"]),
      )
    })

    it("should handle creation errors", async () => {
      db.query.mockRejectedValue(new Error("Duplicate NIT"))

      await expect(ProveedorModel.create(mockProveedorData)).rejects.toThrow("Duplicate NIT")
    })
  })

  describe("update", () => {
    const updateData = {
      nombre: "Ana García Updated",
      telefono: "3001111111",
      nombre_empresa: "Autopartes del Sur S.A.S",
      nit: "800987654-2",
      direccion: "Nueva Carrera 15 #40-25",
      estado: "Activo",
      correo: "ana.updated@autopartessur.com",
      telefono_empresa: "6012222222",
    }

    it("should update supplier successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ProveedorModel.update(1, updateData)

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE proveedor"), [
        "Ana García Updated",
        "3001111111",
        "Autopartes del Sur S.A.S",
        "800987654-2",
        "Nueva Carrera 15 #40-25",
        "Activo",
        "ana.updated@autopartessur.com",
        "6012222222",
        1,
      ])
    })

    it("should handle update errors", async () => {
      db.query.mockRejectedValue(new Error("Update constraint violation"))

      await expect(ProveedorModel.update(1, updateData)).rejects.toThrow("Update constraint violation")
    })
  })

  describe("delete", () => {
    it("should delete supplier successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ProveedorModel.delete(1)

      expect(db.query).toHaveBeenCalledWith("DELETE FROM proveedor WHERE id = ?", [1])
    })

    it("should handle delete errors", async () => {
      db.query.mockRejectedValue(new Error("Cannot delete supplier with purchases"))

      await expect(ProveedorModel.delete(1)).rejects.toThrow("Cannot delete supplier with purchases")
    })
  })

  describe("cambiarEstado", () => {
    it("should change supplier status successfully", async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }])

      await ProveedorModel.cambiarEstado(1, "Inactivo")

      expect(db.query).toHaveBeenCalledWith("UPDATE proveedor SET estado = ? WHERE id = ?", ["Inactivo", 1])
    })

    it("should handle status change errors", async () => {
      db.query.mockRejectedValue(new Error("Status change failed"))

      await expect(ProveedorModel.cambiarEstado(1, "Inactivo")).rejects.toThrow("Status change failed")
    })
  })
})
