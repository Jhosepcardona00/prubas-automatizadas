-- Script unificado Base de datos completa con historial de ventas y citas
-- Fecha de generación 2025-06-23

-- Seguridad de restricciones
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Crear base de datos
CREATE SCHEMA IF NOT EXISTS `bkycg5znhcwzibmiolok` DEFAULT CHARACTER SET utf8;
USE `bkycg5znhcwzibmiolok`;

-- Eliminar tablas existentes (en orden correcto)
DROP TABLE IF EXISTS 
  `venta_cita`, `historial_venta_repuesto`, `historial_venta_servicio`, `historial_cita`, `historial_venta`,
  `cita`, `horario`, `mecanico`, `venta_por_repuesto`, `venta_por_servicio`, `venta`,
  `vehiculo`, `compras_por_repuesto`, `repuesto`, `compras`, `referencia`, `marca`, `cliente`, `categoria_repuesto`,
  `servicio`, `estado_venta`, `estado_cita`, `proveedor`, `permiso_has_rol`, `permiso`, `usuario`, `rol`, `codigos`;

-- Tabla `rol`
CREATE TABLE `rol` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `descripcion` VARCHAR(80),
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `usuario`
CREATE TABLE `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `apellido` VARCHAR(45),
  `tipo_documento` ENUM('Cédula de ciudadanía', 'Tarjeta de identidad', 'Cédula de extranjería', 'Pasaporte', 'NIT', 'Otro'),
  `documento` VARCHAR(45),
  `direccion` VARCHAR(100),
  `correo` VARCHAR(90),
  `password` VARCHAR(255),
  `telefono` VARCHAR(45),
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  `rol_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`correo`),
  FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB;

-- Tabla `permiso`
CREATE TABLE `permiso` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `modulo` VARCHAR(45),
  `accion` VARCHAR(45),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `permiso_has_rol`
CREATE TABLE `permiso_has_rol` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permiso_id` INT NOT NULL,
  `rol_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`permiso_id`) REFERENCES `permiso` (`id`),
  FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB;

-- Tabla `proveedor`
CREATE TABLE `proveedor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `telefono` VARCHAR(45),
  `nombre_empresa` VARCHAR(45),
  `correo` VARCHAR(90),
  `telefono_empresa` VARCHAR(45),
  `nit` VARCHAR(45),
  `direccion` VARCHAR(45),
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id`),
  UNIQUE (`nit`)
) ENGINE=InnoDB;

-- Tabla `compras`
CREATE TABLE `compras` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME,
  `proveedor_id` INT NOT NULL,
  `total` DOUBLE,
  `estado` ENUM('Completado', 'Pendiente', 'Cancelado') DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`)
) ENGINE=InnoDB;

-- Tabla `categoria_repuesto`
CREATE TABLE `categoria_repuesto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `repuesto`
CREATE TABLE `repuesto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `descripcion` VARCHAR(200),
  `categoria_repuesto_id` INT NOT NULL,
  `cantidad` INT,
  `precio_venta` DOUBLE,  -- ← antes preciounitario
  `precio_compra` DOUBLE,
  `estado` ENUM('Activo', 'Inactivo'),
  `total` DOUBLE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`categoria_repuesto_id`) REFERENCES `categoria_repuesto` (`id`)
) ENGINE=InnoDB;

-- Tabla `compras_por_repuesto`
CREATE TABLE `compras_por_repuesto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `compras_id` INT NOT NULL,
  `repuesto_id` INT NOT NULL,
  `cantidad` INT,
  `precio_compra` DOUBLE,
  `precio_venta` DOUBLE,  -- ← nuevo campo agregado
  `subtotal` DOUBLE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`compras_id`) REFERENCES `compras` (`id`),
  FOREIGN KEY (`repuesto_id`) REFERENCES `repuesto` (`id`)
) ENGINE=InnoDB;

-- Tabla `cliente`
CREATE TABLE `cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `apellido` VARCHAR(45),
  `direccion` VARCHAR(45),
  `tipo_documento` ENUM('Cédula de ciudadanía', 'Tarjeta de identidad', 'Cédula de extranjería', 'Pasaporte', 'NIT', 'Otro'),
  `documento` VARCHAR(45),
  `correo` VARCHAR(45),
  `telefono` VARCHAR(45),
  `estado` ENUM('Activo', 'Inactivo'),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `marca`
CREATE TABLE `marca` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `referencia`
CREATE TABLE `referencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `descripcion` VARCHAR(45),
  `marca_id` INT NOT NULL,
  `tipo_vehiculo` ENUM('Carro','Moto','Camioneta'),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`)
) ENGINE=InnoDB;

-- Tabla `vehiculo`
CREATE TABLE `vehiculo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `placa` VARCHAR(6),
  `color` VARCHAR(45),
  `tipo_vehiculo` ENUM('Carro', 'Moto', 'Camioneta'),
  `referencia_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `estado` ENUM('Activo', 'Inactivo'),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`referencia_id`) REFERENCES `referencia` (`id`),
  FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`)
) ENGINE=InnoDB;

-- Tabla `estado_venta`
CREATE TABLE `estado_venta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `mecanico`
CREATE TABLE `mecanico` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `apellido` VARCHAR(45),
  `tipo_documento` ENUM('Cédula de ciudadanía', 'Tarjeta de identidad', 'Cédula de extranjería', 'Pasaporte', 'NIT', 'Otro'),
  `documento` VARCHAR(45),
  `direccion` VARCHAR(100),
  `telefono` VARCHAR(45),
  `telefono_emergencia` VARCHAR(45),
  `correo` VARCHAR(90),
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `venta`
CREATE TABLE `venta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME,
  `cliente_id` INT NOT NULL,
  `mecanico_id` INT DEFAULT NULL,
  `estado_venta_id` INT NOT NULL,
  `total` DOUBLE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`estado_venta_id`) REFERENCES `estado_venta` (`id`)
) ENGINE=InnoDB;

-- Tabla `estado_cita`
CREATE TABLE `estado_cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `cita`
CREATE TABLE `cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `observaciones` TEXT,
  `estado_cita_id` INT NOT NULL,
  `vehiculo_id` INT NOT NULL,
  `mecanico_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`estado_cita_id`) REFERENCES `estado_cita` (`id`),
  FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculo` (`id`),
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`)
) ENGINE=InnoDB;

-- Tabla `horario`
CREATE TABLE `horario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `dia` ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
  `hora_inicio` TIME,
  `hora_fin` TIME,
  `motivo` VARCHAR(200) NOT NULL,
  `tipo_novedad` ENUM('Ausencia', 'Llegada Tarde', 'Salida Temprana', 'Horario Especial') NOT NULL,
  `mecanico_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla `servicio`
CREATE TABLE `servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45),
  `descripcion` VARCHAR(200),
  `precio` DOUBLE,
  `estado` ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `venta_por_servicio`
CREATE TABLE `venta_por_servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `venta_id` INT NOT NULL,
  `servicio_id` INT NOT NULL,
  `subtotal` DOUBLE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`),
  FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`)
) ENGINE=InnoDB;

-- Tabla `venta_por_repuesto`
CREATE TABLE `venta_por_repuesto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `venta_id` INT NOT NULL,
  `repuesto_id` INT NOT NULL,
  `cantidad` INT,
  `subtotal` DOUBLE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`),
  FOREIGN KEY (`repuesto_id`) REFERENCES `repuesto` (`id`)
) ENGINE=InnoDB;

-- Tabla `codigos`
CREATE TABLE `codigos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `correo` VARCHAR(45),
  `codigo` VARCHAR(45),
  `expires_at` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabla `venta_cita`
CREATE TABLE `venta_cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `venta_id` INT NOT NULL,
  `cita_id` INT NOT NULL,
  `fecha_vinculacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `observaciones` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_venta_cita` (`venta_id`, `cita_id`),
  FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cita_id`) REFERENCES `cita` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Historial de ventas
CREATE TABLE `historial_venta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `venta_id` INT NOT NULL,
  `cita_id` INT NULL,
  `cliente_id` INT NOT NULL,
  `vehiculo_id` INT NULL,
  `mecanico_id` INT NULL,
  `fecha_venta` DATETIME NOT NULL,
  `estado_anterior` VARCHAR(45),
  `estado_nuevo` VARCHAR(45),
  `total_venta` DOUBLE,
  `observaciones` TEXT,
  `usuario_modificacion` INT,
  `fecha_modificacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cita_id`) REFERENCES `cita` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculo` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Historial de citas
CREATE TABLE `historial_cita` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cita_id` INT NOT NULL,
  `venta_id` INT NULL,
  `cliente_id` INT NOT NULL,
  `vehiculo_id` INT NOT NULL,
  `mecanico_id` INT NOT NULL,
  `fecha_cita` DATE NOT NULL,
  `hora_cita` TIME NOT NULL,
  `estado_anterior` VARCHAR(45),
  `estado_nuevo` VARCHAR(45),
  `observaciones` TEXT,
  `usuario_modificacion` INT,
  `fecha_modificacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`cita_id`) REFERENCES `cita` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculo` (`id`),
  FOREIGN KEY (`mecanico_id`) REFERENCES `mecanico` (`id`)
) ENGINE=InnoDB;

-- Historial detallado de servicios en ventas
CREATE TABLE `historial_venta_servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `historial_venta_id` INT NOT NULL,
  `servicio_id` INT NOT NULL,
  `servicio_nombre` VARCHAR(100),
  `servicio_descripcion` TEXT,
  `precio_servicio` DOUBLE,
  `subtotal` DOUBLE,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`historial_venta_id`) REFERENCES `historial_venta` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`)
) ENGINE=InnoDB;

-- Historial detallado de repuestos en ventas
CREATE TABLE `historial_venta_repuesto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `historial_venta_id` INT NOT NULL,
  `repuesto_id` INT NOT NULL,
  `repuesto_nombre` VARCHAR(100),
  `repuesto_descripcion` TEXT,
  `categoria_nombre` VARCHAR(100),
  `cantidad` INT,
  `precio_venta` DOUBLE,  -- ← antes precio unitario
  `subtotal` DOUBLE,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`historial_venta_id`) REFERENCES `historial_venta` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`repuesto_id`) REFERENCES `repuesto` (`id`)
) ENGINE=InnoDB;

-- Restaurar configuraciones
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
