// Mock básico para un modelo simple
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
}))

const db = require("../../src/config/db")

// Simulamos un modelo simple de repuesto
const RepuestoModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM repuesto WHERE estado = 'Activo'")
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM repuesto WHERE id = ?", [id])
    return rows[0]
  },

  create: async (data) => {
    const { nombre, precio, stock, categoria_id } = data
    const [result] = await db.query(
      "INSERT INTO repuesto (nombre, precio, stock, categoria_id, estado) VALUES (?, ?, ?, ?, 'Activo')",
      [nombre, precio, stock, categoria_id],
    )
    return result.insertId
  },

  update: async (id, data) => {
    const { nombre, precio, stock, categoria_id } = data
    await db.query("UPDATE repuesto SET nombre = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?", [
      nombre,
      precio,
      stock,
      categoria_id,
      id,
    ])
  },

  delete: async (id) => {
    await db.query("UPDATE repuesto SET estado = 'Inactivo' WHERE id = ?", [id])
  },
}

describe("Modelo Repuesto", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("debería obtener todos los repuestos activos", async () => {
    // Arrange
    const mockRepuestos = [
      { id: 1, nombre: "Filtro de aceite", precio: 25000, stock: 10 },
      { id: 2, nombre: "Pastillas de freno", precio: 85000, stock: 5 },
    ]
    db.query.mockResolvedValue([mockRepuestos])

    // Act
    const resultado = await RepuestoModel.findAll()

    // Assert
    expect(resultado).toEqual(mockRepuestos)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM repuesto WHERE estado = 'Activo'")
  })

  test("debería obtener un repuesto por ID", async () => {
    // Arrange
    const mockRepuesto = { id: 1, nombre: "Filtro de aceite", precio: 25000, stock: 10 }
    db.query.mockResolvedValue([[mockRepuesto]])

    // Act
    const resultado = await RepuestoModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockRepuesto)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM repuesto WHERE id = ?", [1])
  })

  test("debería crear un repuesto correctamente", async () => {
    // Arrange
    const nuevoRepuesto = {
      nombre: "Bujías",
      precio: 15000,
      stock: 20,
      categoria_id: 1,
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await RepuestoModel.create(nuevoRepuesto)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO repuesto (nombre, precio, stock, categoria_id, estado) VALUES (?, ?, ?, ?, 'Activo')",
      ["Bujías", 15000, 20, 1],
    )
  })

  test("debería actualizar un repuesto correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Filtro de aceite premium",
      precio: 35000,
      stock: 15,
      categoria_id: 1,
    }

    // Act
    await RepuestoModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE repuesto SET nombre = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?",
      ["Filtro de aceite premium", 35000, 15, 1, 1],
    )
  })

  test("debería eliminar (desactivar) un repuesto", async () => {
    // Act
    await RepuestoModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE repuesto SET estado = 'Inactivo' WHERE id = ?", [1])
  })
})
