-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: powergym_system
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `fecha` date NOT NULL,
  `horaEntrada` time NOT NULL,
  `horaSalida` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance_entry` (`member_id`,`fecha`,`horaEntrada`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,1,'2024-01-02','08:30:00',NULL),(2,2,'2024-01-02','09:15:00','11:30:00'),(3,1,'2026-02-26','16:33:03',NULL),(4,1,'2026-02-26','16:43:57',NULL),(5,1,'2026-02-26','16:44:33',NULL),(6,1,'2026-02-26','16:45:05',NULL),(7,5,'2026-02-26','16:00:00',NULL),(8,2,'2026-02-26','15:00:00',NULL),(9,1,'2026-02-25','17:00:00',NULL),(10,3,'2026-02-25','18:00:00',NULL),(11,6,'2026-02-25','13:00:00',NULL),(12,2,'2026-02-25','15:00:00',NULL),(13,2,'2026-02-24','16:00:00',NULL),(14,5,'2026-02-24','17:00:00',NULL),(15,6,'2026-02-24','17:00:00',NULL),(16,7,'2026-02-23','18:00:00',NULL),(17,4,'2026-02-23','12:00:00',NULL),(18,2,'2026-02-23','10:00:00',NULL),(19,5,'2026-02-23','15:00:00',NULL),(20,3,'2026-02-22','08:00:00',NULL),(21,5,'2026-02-22','11:00:00',NULL),(22,7,'2026-02-21','17:00:00',NULL),(23,5,'2026-02-21','14:00:00',NULL),(24,4,'2026-02-20','16:00:00',NULL),(25,3,'2026-02-20','08:00:00',NULL),(26,5,'2026-02-20','09:00:00',NULL),(27,2,'2026-02-20','11:00:00',NULL);
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measurements`
--

DROP TABLE IF EXISTS `measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `measurements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `fecha` date NOT NULL,
  `pechoInicial` double DEFAULT NULL,
  `pechoActual` double DEFAULT NULL,
  `brazosInicial` double DEFAULT NULL,
  `brazosActual` double DEFAULT NULL,
  `cinturaInicial` double DEFAULT NULL,
  `cinturaActual` double DEFAULT NULL,
  `piernasInicial` double DEFAULT NULL,
  `piernasActual` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_measurements_member_date` (`member_id`,`fecha`),
  CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measurements`
--

LOCK TABLES `measurements` WRITE;
/*!40000 ALTER TABLE `measurements` DISABLE KEYS */;
INSERT INTO `measurements` VALUES (1,1,'2024-04-15',95,102,35,38,85,82,58,62),(2,2,'2024-04-01',92,88,30,29,78,72,62,58),(3,3,'2026-02-27',90,95,30,32,80,78,50,52),(4,4,'2026-02-27',90,95,30,32,80,78,50,52),(5,5,'2026-02-27',90,95,30,32,80,78,50,52),(6,6,'2026-02-27',90,95,30,32,80,78,50,52),(7,7,'2026-02-27',90,95,30,32,80,78,50,52);
/*!40000 ALTER TABLE `measurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_routines`
--

DROP TABLE IF EXISTS `member_routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_routines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `routine_id` int NOT NULL,
  `fechaAsignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  KEY `routine_id` (`routine_id`),
  CONSTRAINT `member_routines_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_routines_ibfk_2` FOREIGN KEY (`routine_id`) REFERENCES `routines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_routines`
--

LOCK TABLES `member_routines` WRITE;
/*!40000 ALTER TABLE `member_routines` DISABLE KEYS */;
INSERT INTO `member_routines` VALUES (1,1,3,'2026-02-27 17:48:06');
/*!40000 ALTER TABLE `member_routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo_miembro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `edad` int DEFAULT NULL,
  `categoria` enum('fuerza','cardio','funcional','crossfit','otro') COLLATE utf8mb4_unicode_ci DEFAULT 'fuerza',
  `objetivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaInicio` date NOT NULL,
  `estado` enum('activo','inactivo','suspendido') COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `planAlimentacion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_miembro` (`codigo_miembro`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'001','Juan Pérez','juan.perez@email.com','1234567890','J',28,'fuerza','Ganancia muscular','2024-01-15','activo',NULL),(2,'045','María García','maria.garcia@email.com','0987654321','M',32,'cardio','Pérdida de peso','2024-01-10','activo',NULL),(3,'089','Ana Martínez','ana@email.com','5551234567','A',25,'cardio',NULL,'2024-01-02','activo','{\"calorias\":\"2500\",\"proteinas\":\"160\",\"carbohidratos\":\"280\",\"grasas\":\"70\",\"comidas\":[{\"nombre\":\"Desayuno\",\"alimentos\":\"Avena, 4 claras, fruta\",\"horario\":\"08:00 AM\"},{\"nombre\":\"Media Mañana\",\"alimentos\":\"Batido whey\",\"horario\":\"11:00 AM\"},{\"nombre\":\"Almuerzo\",\"alimentos\":\"Pollo 200g, arroz, vegetales\",\"horario\":\"02:00 PM\"},{\"nombre\":\"Merienda\",\"alimentos\":\"Yogurt griego\",\"horario\":\"05:00 PM\"},{\"nombre\":\"Cena\",\"alimentos\":\"Pescado fresco, ensalada\",\"horario\":\"08:00 PM\"}],\"notas\":\"Mantenerse hidratado durante el entrenamiento.\"}'),(4,'123','Carlos López','carlos@email.com','5559876543','C',30,'fuerza',NULL,'2023-12-15','activo','{\"calorias\":\"2500\",\"proteinas\":\"160\",\"carbohidratos\":\"280\",\"grasas\":\"70\",\"comidas\":[{\"nombre\":\"Desayuno\",\"alimentos\":\"Avena, 4 claras, fruta\",\"horario\":\"08:00 AM\"},{\"nombre\":\"Media Mañana\",\"alimentos\":\"Batido whey\",\"horario\":\"11:00 AM\"},{\"nombre\":\"Almuerzo\",\"alimentos\":\"Pollo 200g, arroz, vegetales\",\"horario\":\"02:00 PM\"},{\"nombre\":\"Merienda\",\"alimentos\":\"Yogurt griego\",\"horario\":\"05:00 PM\"},{\"nombre\":\"Cena\",\"alimentos\":\"Pescado fresco, ensalada\",\"horario\":\"08:00 PM\"}],\"notas\":\"Mantenerse hidratado durante el entrenamiento.\"}'),(5,'067','Pedro Sánchez','pedro@email.com','5556667777','P',35,'funcional',NULL,'2024-02-01','activo','{\"calorias\":\"2500\",\"proteinas\":\"160\",\"carbohidratos\":\"280\",\"grasas\":\"70\",\"comidas\":[{\"nombre\":\"Desayuno\",\"alimentos\":\"Avena, 4 claras, fruta\",\"horario\":\"08:00 AM\"},{\"nombre\":\"Media Mañana\",\"alimentos\":\"Batido whey\",\"horario\":\"11:00 AM\"},{\"nombre\":\"Almuerzo\",\"alimentos\":\"Pollo 200g, arroz, vegetales\",\"horario\":\"02:00 PM\"},{\"nombre\":\"Merienda\",\"alimentos\":\"Yogurt griego\",\"horario\":\"05:00 PM\"},{\"nombre\":\"Cena\",\"alimentos\":\"Pescado fresco, ensalada\",\"horario\":\"08:00 PM\"}],\"notas\":\"Mantenerse hidratado durante el entrenamiento.\"}'),(6,'034','Laura Torres','laura@email.com','5553332222','L',22,'crossfit',NULL,'2024-02-10','activo','{\"calorias\":\"2500\",\"proteinas\":\"160\",\"carbohidratos\":\"280\",\"grasas\":\"70\",\"comidas\":[{\"nombre\":\"Desayuno\",\"alimentos\":\"Avena, 4 claras, fruta\",\"horario\":\"08:00 AM\"},{\"nombre\":\"Media Mañana\",\"alimentos\":\"Batido whey\",\"horario\":\"11:00 AM\"},{\"nombre\":\"Almuerzo\",\"alimentos\":\"Pollo 200g, arroz, vegetales\",\"horario\":\"02:00 PM\"},{\"nombre\":\"Merienda\",\"alimentos\":\"Yogurt griego\",\"horario\":\"05:00 PM\"},{\"nombre\":\"Cena\",\"alimentos\":\"Pescado fresco, ensalada\",\"horario\":\"08:00 PM\"}],\"notas\":\"Mantenerse hidratado durante el entrenamiento.\"}'),(7,'200','Miguel Angel','miguel@email.com','5554445555','M',28,'fuerza',NULL,'2024-02-20','activo','{\"calorias\":\"2500\",\"proteinas\":\"160\",\"carbohidratos\":\"280\",\"grasas\":\"70\",\"comidas\":[{\"nombre\":\"Desayuno\",\"alimentos\":\"Avena, 4 claras, fruta\",\"horario\":\"08:00 AM\"},{\"nombre\":\"Media Mañana\",\"alimentos\":\"Batido whey\",\"horario\":\"11:00 AM\"},{\"nombre\":\"Almuerzo\",\"alimentos\":\"Pollo 200g, arroz, vegetales\",\"horario\":\"02:00 PM\"},{\"nombre\":\"Merienda\",\"alimentos\":\"Yogurt griego\",\"horario\":\"05:00 PM\"},{\"nombre\":\"Cena\",\"alimentos\":\"Pescado fresco, ensalada\",\"horario\":\"08:00 PM\"}],\"notas\":\"Mantenerse hidratado durante el entrenamiento.\"}');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberships`
--

DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `tipoMembresia` enum('diaria','semanal','mensual','anual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` double NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaVencimiento` date NOT NULL,
  `estado` enum('activo','vencido','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_membership_period` (`member_id`,`tipoMembresia`,`fechaInicio`),
  CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberships`
--

LOCK TABLES `memberships` WRITE;
/*!40000 ALTER TABLE `memberships` DISABLE KEYS */;
INSERT INTO `memberships` VALUES (1,1,'diaria',1000,'2024-01-15','2024-02-15','activo'),(2,2,'semanal',300,'2024-01-10','2024-01-17','activo'),(3,3,'mensual',1000,'2024-01-02','2024-02-02','activo'),(4,4,'mensual',1000,'2023-12-15','2024-01-15','vencido'),(5,5,'semanal',300,'2024-02-01','2024-02-08','vencido'),(6,6,'mensual',1000,'2024-02-10','2024-03-10','activo'),(7,7,'diaria',50,'2026-02-26','2026-02-26','activo');
/*!40000 ALTER TABLE `memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `monto` double NOT NULL,
  `tipoMembresia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechaPago` date NOT NULL,
  `fechaVencimiento` date NOT NULL,
  `metodoPago` enum('efectivo','tarjeta','transferencia') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'efectivo',
  `estado` enum('pagado','pendiente','vencido','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pagado',
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1000,'mensual','2024-01-15','2024-02-15','tarjeta','pagado'),(2,2,300,'semanal','2024-01-10','2024-01-17','efectivo','pagado'),(3,3,1000,'mensual','2024-01-02','2024-02-02','transferencia','pagado'),(4,4,1000,'mensual','2023-12-15','2024-01-15','efectivo','pagado'),(5,4,1000,'mensual','2024-02-01','2024-03-01','tarjeta','pagado'),(6,5,300,'semanal','2024-02-05','2024-02-12','efectivo','pagado'),(7,6,1000,'mensual','2024-02-10','2024-03-10','transferencia','pagado'),(8,7,50,'diaria','2026-02-26','2026-02-26','efectivo','pagado');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `fecha` date NOT NULL,
  `peso` double NOT NULL,
  `masaMuscular` double DEFAULT NULL,
  `grasaCorporal` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_progress_member_date` (`member_id`,`fecha`),
  CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
INSERT INTO `progress` VALUES (1,1,'2024-01-15',75,35,18),(2,1,'2024-02-15',76.5,36.2,17.2),(3,1,'2024-03-15',78,37.5,16.5),(4,1,'2024-04-15',79.5,38.8,15.8),(5,2,'2024-02-01',72,28,28),(6,2,'2024-03-01',70,28.5,26),(7,2,'2024-04-01',68.5,29,24.5),(8,3,'2025-11-27',80.5,34.7,17.4),(9,3,'2025-12-27',81,34.9,17.1),(10,3,'2026-01-27',81.5,35.1,16.8),(11,3,'2026-02-27',82,35.3,16.5),(12,4,'2025-11-27',78,35.7,27.7),(13,4,'2025-12-27',78.5,35.9,27.4),(14,4,'2026-01-27',79,36.1,27.1),(15,4,'2026-02-27',79.5,36.3,26.8),(16,5,'2025-11-27',84.2,30.7,24.2),(17,5,'2025-12-27',84.7,30.9,23.9),(18,5,'2026-01-27',85.2,31.1,23.6),(19,5,'2026-02-27',85.7,31.3,23.3),(20,6,'2025-11-27',75.6,31.3,26.4),(21,6,'2025-12-27',76.1,31.5,26.1),(22,6,'2026-01-27',76.6,31.7,25.8),(23,6,'2026-02-27',77.1,31.9,25.5),(24,7,'2025-11-27',89.4,36.8,22.6),(25,7,'2025-12-27',89.9,37,22.3),(26,7,'2026-01-27',90.4,37.2,22),(27,7,'2026-02-27',90.9,37.4,21.7);
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routine_exercises`
--

DROP TABLE IF EXISTS `routine_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routine_exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `routine_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `series` int DEFAULT NULL,
  `repeticiones` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descanso` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orden` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `routine_id` (`routine_id`),
  CONSTRAINT `routine_exercises_ibfk_1` FOREIGN KEY (`routine_id`) REFERENCES `routines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine_exercises`
--

LOCK TABLES `routine_exercises` WRITE;
/*!40000 ALTER TABLE `routine_exercises` DISABLE KEYS */;
INSERT INTO `routine_exercises` VALUES (1,1,'Press Banca',4,'8-10','90s',0),(2,1,'Remo con Barra',4,'8-10','90s',1),(4,3,'Pushups',3,'15','60s',0);
/*!40000 ALTER TABLE `routine_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routines`
--

DROP TABLE IF EXISTS `routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'fuerza',
  `duracion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routines`
--

LOCK TABLES `routines` WRITE;
/*!40000 ALTER TABLE `routines` DISABLE KEYS */;
INSERT INTO `routines` VALUES (1,'Fuerza Upper Body','Rutina enfocada en tren superior para ganancia de masa muscular','fuerza','60 min','2026-02-27 02:32:41'),(3,'Test Routine','This is a test routine.','cardio','45 min','2026-02-27 17:46:22');
/*!40000 ALTER TABLE `routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('coach','miembro','recepcionista','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'miembro',
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrador','admin@powergym.local',NULL,'admin',NULL,'$2b$10$5ERUUuuOrPye0KdfQyC52eoR0ypyFkDLtwVmMCyGF3iuyEisTmfa.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 11:57:07
