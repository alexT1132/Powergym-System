CREATE DATABASE IF NOT EXISTS powergym_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE powergym_system;
SET NAMES utf8mb4;

-- Powergym-System database schema
-- Refactored for better normalization, performance and data integrity.

-- users table to store coaches, recepcionistas or miembros que se logean
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    role ENUM('coach', 'miembro', 'recepcionista', 'admin') NOT NULL DEFAULT 'miembro',
    avatar TEXT,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Miembros (Centralizada: une "members" y "clients" de la versión anterior)
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_miembro VARCHAR(50) UNIQUE NOT NULL, -- UUID, Folio o código usado en la interfaz
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(191) UNIQUE,
    telefono VARCHAR(30),
    avatar TEXT,
    edad INT NULL,
    categoria ENUM('fuerza', 'cardio', 'funcional', 'crossfit', 'otro') DEFAULT 'fuerza',
    objetivo VARCHAR(255),
    fechaInicio DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo'
) ENGINE=InnoDB;

-- Membresías (Memberships)
CREATE TABLE IF NOT EXISTS memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    tipoMembresia ENUM('diaria', 'semanal', 'mensual', 'anual') NOT NULL,
    precio DOUBLE NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    estado ENUM('activo', 'vencido', 'cancelado') NOT NULL DEFAULT 'activo',
    UNIQUE KEY uq_membership_period (member_id, tipoMembresia, fechaInicio),
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- progreso de cada miembro en distintos parámetros
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    fecha DATE NOT NULL,
    peso DOUBLE NOT NULL,
    masaMuscular DOUBLE,
    grasaCorporal DOUBLE,
    UNIQUE KEY uq_progress_member_date (member_id, fecha),
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- medidas corporales de cada miembro
CREATE TABLE IF NOT EXISTS measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    fecha DATE NOT NULL,
    pechoInicial DOUBLE,
    pechoActual DOUBLE,
    brazosInicial DOUBLE,
    brazosActual DOUBLE,
    cinturaInicial DOUBLE,
    cinturaActual DOUBLE,
    piernasInicial DOUBLE,
    piernasActual DOUBLE,
    UNIQUE KEY uq_measurements_member_date (member_id, fecha),
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- attendances (asistencias) table para registrar entradas/salidas
CREATE TABLE IF NOT EXISTS attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    fecha DATE NOT NULL,
    horaEntrada TIME NOT NULL,
    horaSalida TIME NULL,
    UNIQUE KEY uq_attendance_entry (member_id, fecha, horaEntrada),
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payments table (cobros o registros de dinero)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    monto DOUBLE NOT NULL,
    tipoMembresia VARCHAR(50) NOT NULL,
    fechaPago DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    metodoPago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL DEFAULT 'efectivo',
    estado ENUM('pagado', 'pendiente', 'vencido', 'cancelado') NOT NULL DEFAULT 'pagado',
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- DATOS DE PRUEBA (SAMPLE DATA)
-- ==========================================

INSERT IGNORE INTO members(id, codigo_miembro, nombre, email, telefono, avatar, edad, categoria, objetivo, fechaInicio) VALUES
(1, '001', 'Juan Pérez', 'juan.perez@email.com', '1234567890', 'J', 28, 'fuerza', 'Ganancia muscular', '2024-01-15'),
(2, '045', 'María García', 'maria.garcia@email.com', '0987654321', 'M', 32, 'cardio', 'Pérdida de peso', '2024-01-10');

INSERT IGNORE INTO memberships(member_id, tipoMembresia, precio, fechaInicio, fechaVencimiento, estado) VALUES
(1, 'mensual', 1000, '2024-01-15', '2024-02-15', 'activo'),
(2, 'semanal', 300, '2024-01-10', '2024-01-17', 'activo');

-- Progress entries for Juan Pérez (member_id 1)
INSERT IGNORE INTO progress(member_id, fecha, peso, masaMuscular, grasaCorporal) VALUES
(1, '2024-01-15', 75, 35, 18),
(1, '2024-02-15', 76.5, 36.2, 17.2),
(1, '2024-03-15', 78, 37.5, 16.5),
(1, '2024-04-15', 79.5, 38.8, 15.8);

INSERT IGNORE INTO measurements(member_id, fecha, pechoInicial, pechoActual, brazosInicial, brazosActual, cinturaInicial, cinturaActual, piernasInicial, piernasActual) VALUES
(1, '2024-04-15', 95, 102, 35, 38, 85, 82, 58, 62);

-- Progress entries for María García (member_id 2)
INSERT IGNORE INTO progress(member_id, fecha, peso, masaMuscular, grasaCorporal) VALUES
(2, '2024-02-01', 72, 28, 28),
(2, '2024-03-01', 70, 28.5, 26),
(2, '2024-04-01', 68.5, 29, 24.5);

INSERT IGNORE INTO measurements(member_id, fecha, pechoInicial, pechoActual, brazosInicial, brazosActual, cinturaInicial, cinturaActual, piernasInicial, piernasActual) VALUES
(2, '2024-04-01', 92, 88, 30, 29, 78, 72, 62, 58);

-- example attendance entries
INSERT IGNORE INTO attendances(member_id, fecha, horaEntrada, horaSalida) VALUES
(1, '2024-01-02', '08:30:00', NULL),
(2, '2024-01-02', '09:15:00', '11:30:00');
