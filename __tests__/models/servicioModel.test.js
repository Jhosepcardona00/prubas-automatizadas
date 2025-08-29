const ServicioModel = require("../../src/models/servicioModel")


// Mock de la base de datos
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
}))

const db = require("../../src/config/db")

describe("Modelo Servicio", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("debería obtener todos los servicios correctamente", async () => {
    // Arrange
    const mockServicios = [
      {
        id: 1,
        nombre: "Cambio de aceite",
        descripcion: "Cambio de aceite y filtro",
        precio: 50000,
        estado: "Activo",
      },
      {
        id: 2,
        nombre: "Revisión de frenos",
        descripcion: "Inspección completa del sistema de frenos",
        precio: 80000,
        estado: "Activo",
      },
    ]
    db.query.mockResolvedValue([mockServicios])

    // Act
    const resultado = await ServicioModel.findAll()

    // Assert
    expect(resultado).toEqual(mockServicios)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM servicio")
  })

  test("debería obtener un servicio por ID correctamente", async () => {
    // Arrange
    const mockServicio = {
      id: 1,
      nombre: "Cambio de aceite",
      descripcion: "Cambio de aceite y filtro",
      precio: 50000,
      estado: "Activo",
    }
    db.query.mockResolvedValue([[mockServicio]])

    // Act
    const resultado = await ServicioModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockServicio)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM servicio WHERE id = ?", [1])
  })

  test("debería crear un servicio nuevo correctamente", async () => {
    // Arrange
    const nuevoServicio = {
      nombre: "Alineación y balanceo",
      descripcion: "Alineación y balanceo de llantas",
      precio: 120000,
      estado: "Activo",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await ServicioModel.create(nuevoServicio)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)",
      ["Alineación y balanceo", "Alineación y balanceo de llantas", 120000, "Activo"],
    )
  })

  test("debería crear un servicio con estado por defecto cuando no se proporciona", async () => {
    // Arrange
    const nuevoServicio = {
      nombre: "Diagnóstico computarizado",
      descripcion: "Diagnóstico completo del vehículo",
      precio: 75000,
    }
    const mockResult = { insertId: 4 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await ServicioModel.create(nuevoServicio)

    // Assert
    expect(resultado).toBe(4)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO servicio (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)",
      ["Diagnóstico computarizado", "Diagnóstico completo del vehículo", 75000, "Activo"],
    )
  })

  test("debería actualizar un servicio correctamente", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Cambio de aceite premium",
      descripcion: "Cambio de aceite sintético y filtro de alta calidad",
      precio: 85000,
      estado: "Activo",
    }
    db.query.mockResolvedValue([])

    // Act
    await ServicioModel.update(1, datosActualizacion)

    // Assert
    expect(db.query).toHaveBeenCalledWith(
      "UPDATE servicio SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id = ?",
      ["Cambio de aceite premium", "Cambio de aceite sintético y filtro de alta calidad", 85000, "Activo", 1],
    )
  })

  test("debería eliminar un servicio correctamente", async () => {
    // Arrange
    db.query.mockResolvedValue([])

    // Act
    await ServicioModel.delete(1)

    // Assert
    expect(db.query).toHaveBeenCalledWith("DELETE FROM servicio WHERE id = ?", [1])
  })

  test("debería cambiar el estado de un servicio correctamente", async () => {
    // Arrange
    db.query.mockResolvedValue([])

    // Act
    await ServicioModel.cambiarEstado(1, "Inactivo")

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE servicio SET estado = ? WHERE id = ?", ["Inactivo", 1])
  })

  test("debería manejar errores en la consulta findAll", async () => {
    // Arrange
    const error = new Error("Database connection error")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.findAll()).rejects.toThrow("Database connection error")
  })

  test("debería manejar errores en la consulta findById", async () => {
    // Arrange
    const error = new Error("Database query error")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.findById(1)).rejects.toThrow("Database query error")
  })

  test("debería manejar errores en la creación de servicio", async () => {
    // Arrange
    const nuevoServicio = {
      nombre: "Test servicio",
      descripcion: "Test descripción",
      precio: 50000,
    }
    const error = new Error("Insert failed")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.create(nuevoServicio)).rejects.toThrow("Insert failed")
  })

  test("debería manejar errores en la actualización de servicio", async () => {
    // Arrange
    const datosActualizacion = {
      nombre: "Test update",
      descripcion: "Test descripción",
      precio: 60000,
      estado: "Activo",
    }
    const error = new Error("Update failed")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.update(1, datosActualizacion)).rejects.toThrow("Update failed")
  })

  test("debería manejar errores en la eliminación de servicio", async () => {
    // Arrange
    const error = new Error("Delete failed")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.delete(1)).rejects.toThrow("Delete failed")
  })

  test("debería manejar errores en el cambio de estado", async () => {
    // Arrange
    const error = new Error("State change failed")
    db.query.mockRejectedValue(error)

    // Act & Assert
    await expect(ServicioModel.cambiarEstado(1, "Inactivo")).rejects.toThrow("State change failed")
  })
})
