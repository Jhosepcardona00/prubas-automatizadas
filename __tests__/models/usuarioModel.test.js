const UsuarioModel = require("../../src/models/usuarioModel")
// ...existing code...

// Mock de la base de datos
jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
  getConnection: jest.fn(() => ({
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
  })),
}))

const db = require("../../src/config/db")

describe("Modelo Usuario", () => {
  let mockConnection

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks()

    // Configurar mock de conexión
    mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
    }

    db.getConnection.mockResolvedValue(mockConnection)
  })

  test("debería obtener todos los usuarios correctamente", async () => {
    // Arrange
    const mockUsuarios = [
      { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@test.com", rol_nombre: "Admin" },
      { id: 2, nombre: "María", apellido: "García", correo: "maria@test.com", rol_nombre: "Cliente" },
    ]
    db.query.mockResolvedValue([mockUsuarios])

    // Act
    const resultado = await UsuarioModel.findAll()

    // Assert
    expect(resultado).toEqual(mockUsuarios)
    expect(db.query).toHaveBeenCalledWith(`
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
    `)
  })

  test("debería obtener un usuario por ID correctamente", async () => {
    // Arrange
    const mockUsuario = { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@test.com" }
    db.query.mockResolvedValue([[mockUsuario]])

    // Act
    const resultado = await UsuarioModel.findById(1)

    // Assert
    expect(resultado).toEqual(mockUsuario)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM usuario WHERE id = ?", [1])
  })

  test("debería obtener un usuario por email correctamente", async () => {
    // Arrange
    const mockUsuario = { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@test.com", rol: "Admin" }
    db.query.mockResolvedValue([[mockUsuario]])

    // Act
    const resultado = await UsuarioModel.findByEmail("juan@test.com")

    // Assert
    expect(resultado).toEqual(mockUsuario)
    expect(db.query).toHaveBeenCalledWith(
      `
      SELECT u.*, r.nombre AS rol
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
      WHERE u.correo = ?
    `,
      ["juan@test.com"],
    )
  })

  test("debería crear un usuario correctamente", async () => {
    // Arrange
    const nuevoUsuario = {
      nombre: "Carlos",
      apellido: "López",
      tipo_documento: "CC",
      documento: "12345678",
      correo: "carlos@test.com",
      password: "password123",
      rol_id: 2,
      telefono: "3001234567",
      direccion: "Calle 123",
    }
    const mockResult = { insertId: 3 }
    db.query.mockResolvedValue([mockResult])

    // Act
    const resultado = await UsuarioModel.create(nuevoUsuario)

    // Assert
    expect(resultado).toBe(3)
    expect(db.query).toHaveBeenCalledWith(
      "INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nuevoUsuario.nombre,
        nuevoUsuario.apellido,
        nuevoUsuario.correo,
        nuevoUsuario.tipo_documento,
        nuevoUsuario.documento,
        nuevoUsuario.password,
        nuevoUsuario.rol_id,
        nuevoUsuario.telefono,
        nuevoUsuario.direccion,
      ],
    )
  })

  test("debería actualizar la contraseña de un usuario", async () => {
    // Arrange
    const userId = 1
    const newPassword = "newPassword123"

    // Act
    await UsuarioModel.updatePassword(userId, newPassword)

    // Assert
    expect(db.query).toHaveBeenCalledWith("UPDATE usuario SET password = ? WHERE id = ?", [newPassword, userId])
  })

  test("debería cambiar el estado de un usuario correctamente", async () => {
    // Arrange
    const userId = 1
    const nuevoEstado = "Inactivo"

    // Act
    await UsuarioModel.cambiarEstado(userId, nuevoEstado)

    // Assert
    expect(mockConnection.beginTransaction).toHaveBeenCalled()
    expect(mockConnection.commit).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })

  test("debería manejar errores en transacciones", async () => {
    // Arrange
    const userId = 1
    const nuevoEstado = "Inactivo"
    const error = new Error("Database error")
    mockConnection.query.mockRejectedValue(error)

    // Act & Assert
    await expect(UsuarioModel.cambiarEstado(userId, nuevoEstado)).rejects.toThrow("Database error")
    expect(mockConnection.rollback).toHaveBeenCalled()
    expect(mockConnection.release).toHaveBeenCalled()
  })
})
