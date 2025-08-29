# Automatización de Pruebas con GitHub Actions

Este proyecto incluye una configuración de integración continua (CI) usando GitHub Actions para ejecutar pruebas automáticas en cada push y pull request a las ramas `main` y `develop`.

## Configuración de GitHub Actions

La automatización está definida en `.github/workflows/ci.yml` y realiza lo siguiente:

1. Detecta eventos de push y pull request en las ramas principales.
2. Instala dependencias usando Node.js 20.x.
3. Ejecuta las pruebas con el comando `npm test`.

## Instrucciones para activar la automatización

1. Asegúrate de tener el archivo `.github/workflows/ci.yml` en tu repositorio.
2. Las pruebas deben estar configuradas en tu proyecto y ejecutarse con `npm test`.
3. Al hacer un push o crear un pull request, GitHub Actions ejecutará automáticamente las pruebas.

## Pruebas automáticas

Las pruebas que se ejecutan automáticamente son las mismas desarrolladas en la asignatura de pruebas y están ubicadas en la carpeta `__tests__`.

## Ejemplo de ejecución

- Realiza un cambio en el código y haz push a la rama `main` o `develop`.
- Crea un pull request hacia `main` o `develop`.
- GitHub Actions ejecutará las pruebas y mostrará el resultado en la pestaña "Actions" del repositorio.

## Recursos
- [Documentación oficial de GitHub Actions](https://docs.github.com/en/actions)
# API MotOrtega - Sistema de Gestión de Taller Mecánico

## Descripción del Proyecto

API REST completa para la gestión integral de un taller mecánico, desarrollada con Node.js y Express. El sistema permite administrar clientes, vehículos, citas, ventas, inventario de repuestos, servicios, mecánicos y generar reportes estadísticos completos.

### Funcionalidades Principales

- **Gestión de Usuarios y Roles**: Sistema de autenticación con JWT y control de permisos
- **Gestión de Clientes**: CRUD completo de clientes y sus vehículos
- **Sistema de Citas**: Programación y seguimiento de citas con mecánicos
- **Gestión de Ventas**: Registro de ventas con servicios y repuestos
- **Inventario**: Control de repuestos, categorías y proveedores
- **Reportes y Dashboard**: Estadísticas completas del negocio
- **Sistema de Historial**: Trazabilidad completa de operaciones
- **Gestión de Horarios**: Control de disponibilidad de mecánicos

### Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcryptjs
- **Validación**: express-validator
- **Email**: Nodemailer
- **Testing**: Jest
- **Documentación**: JSDoc

## Requisitos del Sistema

- Node.js >= 14.0.0
- MySQL >= 8.0
- npm >= 6.0.0

## Instalación y Configuración

### 1. Clonar el Repositorio

\`\`\`bash
git clone https://github.com/kleiber123456/preuebas-1.git
cd api-motortega
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

\`\`\`env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bkycg5znhcwzibmiolok

# Configuración JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Configuración del Servidor
PORT=5000

# Configuración de Email (para recuperación de contraseña)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
\`\`\`

### 4. Configurar Base de Datos

#### Opción A: Importar Script Completo
\`\`\`bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de base de datos
mysql -u root -p < database/schema.sql
\`\`\`

#### Opción B: Crear Base de Datos Manualmente
\`\`\`sql
-- Crear la base de datos
CREATE DATABASE bkycg5znhcwzibmiolok;
USE bkycg5znhcwzibmiolok;

-- Ejecutar el contenido del archivo database/schema.sql
\`\`\`

### 5. Verificar Conexión

\`\`\`bash
# Probar la conexión a la base de datos
npm run test:db
\`\`\`

## Instrucciones de Ejecución

### Desarrollo

\`\`\`bash
# Iniciar servidor en modo desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5000
\`\`\`

### Producción

\`\`\`bash
# Construir para producción
npm run build

# Iniciar servidor en producción
npm start
\`\`\`

### Verificar que el Servidor Funciona

\`\`\`bash
# Probar endpoint principal
curl http://localhost:5000

# Debería retornar información de la API
\`\`\`

## Instrucciones de Ejecución de Pruebas Unitarias

### Ejecutar Todas las Pruebas

\`\`\`bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage
\`\`\`

### Ejecutar Pruebas Específicas

\`\`\`bash
# Solo pruebas de modelos
npm run test:models

# Solo pruebas de controladores
npm run test:controllers

# Ejecutar un archivo específico
npm test clienteModel.test.js

# Ejecutar pruebas que coincidan con un patrón
npm test -- --testNamePattern="debería crear"
\`\`\`

### Pruebas en Modo Watch

\`\`\`bash
# Ejecutar pruebas en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch
\`\`\`

### Ver Reporte de Cobertura

\`\`\`bash
# Generar y abrir reporte de cobertura
npm run test:coverage
open coverage/lcov-report/index.html
\`\`\`

## Clases del Modelo de Negocio con Pruebas Unitarias

El proyecto incluye pruebas unitarias para las siguientes **5 clases principales** del modelo de negocio:

### 1. ClienteModel (`src/models/clienteModel.js`)
- **Archivo de prueba**: `__tests__/models/clienteModel.test.js`
- **Funcionalidades probadas**: CRUD completo, validaciones, manejo de errores

### 2. UsuarioModel (`src/models/usuarioModel.js`)
- **Archivo de prueba**: `__tests__/models/usuarioModel.test.js`
- **Funcionalidades probadas**: Autenticación, encriptación, roles

### 3. VentaModel (`src/models/ventaModel.js`)
- **Archivo de prueba**: `__tests__/models/ventaModel.test.js`
- **Funcionalidades probadas**: Transacciones, cálculos, historial

### 4. RepuestoModel (`src/models/repuestoModel.js`)
- **Archivo de prueba**: `__tests__/models/repuestoModel.test.js`
- **Funcionalidades probadas**: Inventario, precios, categorías

### 5. ServicioModel (`src/models/servicioModel.js`)
- **Archivo de prueba**: `__tests__/models/servicioModel.test.js`
- **Funcionalidades probadas**: CRUD, estados, precios

### Cobertura de Pruebas

- **Cobertura mínima requerida**: 70%
- **Métricas cubiertas**: Líneas, funciones, branches, statements
- **Casos probados**: Casos exitosos, manejo de errores, validaciones

## Estructura del Proyecto

\`\`\`
api-motortega/
├── src/
│   ├── config/
│   │   ├── db.js                 # Configuración de base de datos
│   │   └── nodemailer.js         # Configuración de email
│   ├── controllers/              # Controladores de la API
│   ├── models/                   # Modelos de datos
│   ├── routes/                   # Definición de rutas
│   ├── services/                 # Lógica de negocio
│   ├── middleware/               # Middleware personalizado
│   ├── utils/                    # Utilidades
│   ├── app.js                    # Configuración de Express
│   └── server.js                 # Punto de entrada
├── __tests__/                    # Pruebas unitarias
│   ├── models/                   # Tests de modelos
│   ├── controllers/              # Tests de controladores
│   ├── setup.js                  # Configuración de Jest
│   └── utils/                    # Utilidades de testing
├── database/
│   └── schema.sql                # Script de base de datos
├── coverage/                     # Reportes de cobertura
├── jest.config.js                # Configuración de Jest
├── package.json                  # Dependencias y scripts
└── README.md                     # Este archivo
\`\`\`

## API Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/solicitar-codigo` - Solicitar código de recuperación
- `POST /api/auth/verificar-codigo` - Verificar código
- `POST /api/auth/nueva-password` - Actualizar contraseña

### Gestión de Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/:id` - Obtener cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Gestión de Citas
- `GET /api/citas` - Listar citas
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id` - Actualizar cita
- `PUT /api/citas/:id/cambiar-estado` - Cambiar estado de cita

### Gestión de Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Crear venta
- `PUT /api/ventas/:id/cambiar-estado` - Cambiar estado de venta
- `POST /api/ventas/:id/vincular-cita` - Vincular venta con cita

### Dashboard y Reportes
- `GET /api/dashboard/estadisticas` - Estadísticas generales
- `GET /api/dashboard/ventas-recientes` - Ventas recientes
- `GET /api/dashboard/tendencias-ventas` - Tendencias de ventas

## Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo
npm start               # Iniciar en producción

# Testing
npm test                # Ejecutar todas las pruebas
npm run test:watch      # Pruebas en modo watch
npm run test:coverage   # Pruebas con cobertura
npm run test:models     # Solo pruebas de modelos
npm run test:controllers # Solo pruebas de controladores
npm run test:verbose    # Pruebas con salida detallada
npm run test:silent     # Pruebas sin salida detallada

# Utilidades
npm run lint            # Verificar código
npm run format          # Formatear código
\`\`\`

## Despliegue

### Despliegue Local

1. Seguir las instrucciones de instalación
2. Configurar variables de entorno
3. Importar base de datos
4. Ejecutar `npm start`

### Despliegue en Servidor

1. Clonar repositorio en el servidor
2. Instalar dependencias: `npm install --production`
3. Configurar variables de entorno
4. Configurar base de datos MySQL
5. Usar PM2 para gestión de procesos:

\`\`\`bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start src/server.js --name "api-motortega"

# Configurar inicio automático
pm2 startup
pm2 save
\`\`\`

### Variables de Entorno para Producción

\`\`\`env
NODE_ENV=production
DB_HOST=tu_host_produccion
DB_USER=tu_usuario_produccion
DB_PASSWORD=tu_password_seguro
DB_NAME=bkycg5znhcwzibmiolok
JWT_SECRET=jwt_secret_muy_seguro_para_produccion
PORT=5000
EMAIL_USER=email_corporativo@empresa.com
EMAIL_PASS=password_aplicacion_seguro
\`\`\`

## Solución de Problemas

### Error de Conexión a Base de Datos
\`\`\`bash
# Verificar que MySQL esté ejecutándose
sudo service mysql status

# Verificar credenciales en .env
# Verificar que la base de datos existe
\`\`\`

### Error en Pruebas
\`\`\`bash
# Limpiar caché de Jest
npm test -- --clearCache

# Ejecutar pruebas con más información
npm run test:verbose
\`\`\`

### Puerto en Uso
\`\`\`bash
# Cambiar puerto en .env o matar proceso
lsof -ti:5000 | xargs kill -9
\`\`\`

## Contacto

- **Desarrollador**: MotOrtega

## Changelog

### v4.0.0 - Sistema Completo
- ✅ Sistema completo de historial y vinculación venta-cita
- ✅ 5 clases del modelo con pruebas unitarias completas
- ✅ Dashboard con estadísticas avanzadas
- ✅ Sistema de autenticación robusto
- ✅ Documentación completa
- ✅ Cobertura de pruebas > 70%
