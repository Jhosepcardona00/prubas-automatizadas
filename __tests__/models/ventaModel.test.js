const VentaModel = require("../../src/models/ventaModel")


// Mock de la base de datos
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
}))

const db = require("../../src/config/db")

describe("Modelo Venta", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("debería obtener todas las ventas correctamente", async () => {
    // Arrange
    const mockVentas = [
      {
        id: 1,
        fecha: "2024-01-15",
        cliente_id: 1,
        cliente_nombre: "Juan",
        cliente_apellido: "Pérez",
        estado_nombre: "Pagada",
        total: 150000,
      },
      {
        id: 2,
        fecha: "2024-01-16",
        cliente_id: 2,
        cliente_nombre: "María",
        cliente_apellido: "García",
        estado_nombre: "Pendiente",
        total: 200000,
      },
    ]
    db.query.mockResolvedValue([mockVentas])

    // Act
    const resultado = await VentaModel.findAll()

    // Assert
    expect(resultado).toEqual(mockVentas)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT v.*"))
  })

  test("debería obtener una venta por ID correctamente", async () => {
    // Arrange
    const mockVenta = {
      id: 1,
      fecha: "2024-01-15",
      cliente_id: 1,
      cliente_nombre: "Juan",
      cliente_apellido: "Pérez",
      estado_nombre: "Pagada",
      total: 150000,
    }
    db.query.mockResolvedValue([[mockVenta]])

    // Act
    const resultado = await VentaModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockVenta)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.id = ?"), [1])
  })

  test("debería obtener ventas por cliente correctamente", async () => {
    // Arrange
    const mockVentas = [
      {
        id: 1,
        fecha: "2024-01-15",
        cliente_id: 1,
        estado_nombre: "Pagada",
        total: 150000,
      },
      {
        id: 3,
        fecha: "2024-01-20",
        cliente_id: 1,
        estado_nombre: "Pendiente",
        total: 100000,
      },
    ]
    db.query.mockResolvedValue([mockVentas])

    // Act
    const resultado = await VentaModel.findByCliente(1)

    // Assert
    expect(resultado).toEqual(mockVentas)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.cliente_id = ?"), [1])
  })

  test("debería obtener ventas por estado correctamente", async () => {
    // Arrange
    const mockVentas = [
      {
        id: 1,
        fecha: "2024-01-15",
        estado_venta_id: 2,
        estado_nombre: "Pagada",
        total: 150000,
      },
    ]
    db.query.mockResolvedValue([mockVentas])

    // Act
    const resultado = await VentaModel.findByEstado(2)

    // Assert
    expect(resultado).toEqual(mockVentas)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE v.estado_venta_id = ?"), [2])
  })

  test("debería obtener ventas por rango de fechas correctamente", async () => {
    // Arrange
    const mockVentas = [
      {
        id: 1,
        fecha: "2024-01-15",
        total: 150000,
      },
      {
        id: 2,
        fecha: "2024-01-16",
        total: 200000,
      },
    ]
    db.query.mockResolvedValue([mockVentas])

    // Act
    const resultado = await VentaModel.findByDateRange("2024-01-15", "2024-01-16")

    // Assert
    expect(resultado).toEqual(mockVentas)
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE DATE(v.fecha) BETWEEN ? AND ?"), [
      "2024-01-15",
      "2024-01-16",
    ])
  })

  test("debería crear una venta correctamente", async () => {
    // Arrange
    const nuevaVenta = {
      fecha: "2024-01-17",
      cliente_id: 1,
      estado_venta_id: 1,
      mecanico_id: 2,
      total: 175000,
    }
    const mockResult = { insertId: 5 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await VentaModel.create(nuevaVenta)

    // Assert
    expect(resultado).toBe(5)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO venta (fecha, cliente_id, estado_venta_id, mecanico_id, total) VALUES (?, ?, ?, ?, ?)",
      ["2024-01-17", 1, 1, 2, 175000],
    )
  })

  test("debería crear una venta con valores por defecto", async () => {
    // Arrange
    const ventaMinima = {
      cliente_id: 1,
      estado_venta_id: 1,
    }
    const mockResult = { insertId: 6 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await VentaModel.create(ventaMinima)

    // Assert
    expect(resultado).toBe(6)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO venta (fecha, cliente_id, estado_venta_id, mecanico_id, total) VALUES (?, ?, ?, ?, ?)",
      [expect.any(Date), 1, 1, null, 0],
    )
  })

  test("debería actualizar una venta correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      fecha: "2024-01-18",
      cliente_id: 2,
      estado_venta_id: 2,
      mecanico_id: 3,
      total: 250000,
    }

    // Act
    await VentaModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE venta SET fecha = ?, cliente_id = ?, estado_venta_id = ?, mecanico_id = ?, total = ? WHERE id = ?",
      ["2024-01-18", 2, 2, 3, 250000, 1],
    )
  })

  test("debería eliminar una venta correctamente", async () => {
    // Act
    await VentaModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith("DELETE FROM venta WHERE id = ?", [1])
  })

  test("debería cambiar el estado de una venta", async () => {
    // Act
    await VentaModel.cambiarEstado(1, 3)

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE venta SET estado_venta_id = ? WHERE id = ?", [3, 1])
  })
})
