import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

// allow CORS for development (if needed)
import cors from 'cors';
app.use(cors());

// database connection (mysql2 pool)
import db from './db.js';
import bcrypt from 'bcrypt';

// setup database tables
async function setupDatabase() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        telefono VARCHAR(30),
        role ENUM('coach', 'miembro', 'recepcionista', 'admin') NOT NULL DEFAULT 'miembro',
        avatar TEXT,
        password VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Members table
    await db.query(`
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo_miembro VARCHAR(50) UNIQUE NOT NULL,
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
    `);

    // Memberships
    await db.query(`
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
    `);

    // Progress
    await db.query(`
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
    `);

    // Measurements
    await db.query(`
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
    `);

    // Attendance
    await db.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT NOT NULL,
        fecha DATE NOT NULL,
        horaEntrada TIME NOT NULL,
        horaSalida TIME NULL,
        UNIQUE KEY uq_attendance_entry (member_id, fecha, horaEntrada),
        FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Payments
    await db.query(`
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
    `);

    // Routines
    await db.query(`
      CREATE TABLE IF NOT EXISTS routines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(100),
        duracion VARCHAR(100)
      ) ENGINE=InnoDB;
    `);

    // Routine exercises
    await db.query(`
      CREATE TABLE IF NOT EXISTS routine_exercises (
        id INT AUTO_INCREMENT PRIMARY KEY,
        routine_id INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        series INT,
        repeticiones VARCHAR(100),
        descanso VARCHAR(100),
        orden INT,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Member routines
    await db.query(`
      CREATE TABLE IF NOT EXISTS member_routines (
        member_id INT NOT NULL,
        routine_id INT NOT NULL,
        PRIMARY KEY (member_id, routine_id),
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
        FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('Database tables setup completed');
  } catch (err) {
    console.error('Failed to setup database tables', err);
  }
}

// ensure admin user exists
async function ensureAdmin() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    // use INSERT IGNORE in case it already exists (by nombre or role)
    await db.query(
      `INSERT IGNORE INTO users (nombre,email,role,password) VALUES (?,?,?,?)`,
      ['Administrador', 'admin@powergym.local', 'admin', passwordHash]
    );
    console.log('Admin user ensured');
  } catch (err) {
    console.error('Failed to ensure admin user', err);
  }
}

// simple example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// login endpoint
app.use(express.json());
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing fields' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    // for now return basic user info
    res.json({ id: user.id, nombre: user.nombre, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// helper to generate unique member id
async function generateMemberId() {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100 + 1)) + 100;
    id = id.toString().padStart(3, '0');
    const [rows] = await db.query('SELECT id FROM members WHERE id = ?', [id]);
    if (rows.length === 0) break;
  }
  return id;
}

// registration endpoint for new miembros
app.post('/api/auth/register', async (req, res) => {
  const { nombre, apellido, email, telefono, fechaNacimiento, password, tipoMembresia, precio } = req.body;
  if (!nombre || !email || !password || !tipoMembresia || !precio) {
    return res.status(400).json({ error: 'missing fields' });
  }
  try {
    const memberId = await generateMemberId();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO members(id,nombre,email,telefono) VALUES (?,?,?,?)', [memberId, nombre + (apellido ? ' ' + apellido : ''), email, telefono]);
    const fechaInicio = new Date().toISOString().split('T')[0];
    // simple expiration: mensual = +1 month, semanal = +7 days, diaria = +1 day
    let vencimiento = new Date();
    if (tipoMembresia === 'mensual') vencimiento.setMonth(vencimiento.getMonth() + 1);
    else if (tipoMembresia === 'semanal') vencimiento.setDate(vencimiento.getDate() + 7);
    else if (tipoMembresia === 'diaria') vencimiento.setDate(vencimiento.getDate() + 1);
    const fechaVencimiento = vencimiento.toISOString().split('T')[0];
    await db.query('INSERT INTO memberships(member_id,tipoMembresia,precio,fechaInicio,fechaVencimiento,estado) VALUES (?,?,?,?,?,?)',
      [memberId, tipoMembresia, precio, fechaInicio, fechaVencimiento, 'activo']);
    await db.query('INSERT INTO users(nombre,email,role,password) VALUES (?,?,?,?)',
      [nombre + (apellido ? ' ' + apellido : ''), email, 'miembro', passwordHash]);
    res.json({ memberId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// attendance endpoints
app.post('/api/attendance', async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: 'missing memberId' });
  try {
    // check member exists either by ID or by codigo_miembro
    const [mem] = await db.query('SELECT id FROM members WHERE id = ? OR codigo_miembro = ? LIMIT 1', [memberId, memberId]);
    if (mem.length === 0) return res.status(404).json({ error: 'member not found' });

    const realMemberId = mem[0].id;
    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];
    // insert attendance with only entry time
    await db.query('INSERT INTO attendances(member_id,fecha,horaEntrada) VALUES (?,?,?)', [realMemberId, fecha, hora]);
    res.json({ success: true, fecha, hora });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya tiene asistencia registrada hoy a esta hora' });
    }
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id, a.member_id, a.fecha, a.horaEntrada, a.horaSalida, 
        m.nombre, m.codigo_miembro, m.avatar 
      FROM attendances a
      LEFT JOIN members m ON m.id = a.member_id
      ORDER BY a.fecha DESC, a.horaEntrada DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// example route that reads members from MariaDB/MySQL
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// DELETE member route
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM members WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Update member route
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, tipoMembresia } = req.body;
  try {
    await db.query('UPDATE members SET nombre=?, email=?, telefono=? WHERE id = ?', [nombre, email, telefono, id]);
    // Also try to update membership if needed (simplified for this mock setup)
    if (tipoMembresia) {
      await db.query('UPDATE memberships SET tipoMembresia=? WHERE member_id = ?', [tipoMembresia, id]);
    }
    res.json({ id, nombre, email, telefono, tipoMembresia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Dashboard Stats Endpoint ---
app.get('/api/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total members
    const [membersCount] = await db.query('SELECT COUNT(*) as total FROM members WHERE estado = "activo"');

    // Attendances today
    const [attendanceToday] = await db.query('SELECT COUNT(*) as total FROM attendances WHERE fecha = ?', [today]);

    // Memberships expiring soon (next 7 days)
    const [expiringSoon] = await db.query('SELECT COUNT(*) as total FROM memberships WHERE fechaVencimiento BETWEEN ? AND ?',
      [today, new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]]);

    // Payments revenue (sum of all 'pagado' payments this month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [revenueRows] = await db.query('SELECT SUM(monto) as total FROM payments WHERE estado = "pagado" AND fechaPago LIKE ?', [`${currentMonth}%`]);

    res.json({
      activeMembers: membersCount[0].total,
      attendanceToday: attendanceToday[0].total,
      totalRevenue: revenueRows[0].total || 0,
      expiringSoon: expiringSoon[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Payments Endpoints ---
app.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, m.nombre, m.codigo_miembro, m.avatar 
      FROM payments p
      JOIN members m ON m.id = p.member_id
      ORDER BY p.fechaPago DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/payments', async (req, res) => {
  const { memberId, monto, tipoMembresia, metodoPago } = req.body;

  if (!memberId || !monto || !tipoMembresia) {
    return res.status(400).json({ error: 'missing fields' });
  }

  try {
    // 1. Check member exists
    const [mem] = await db.query('SELECT id FROM members WHERE id = ? OR codigo_miembro = ? LIMIT 1', [memberId, memberId]);
    if (mem.length === 0) return res.status(404).json({ error: 'miembro no encontrado' });

    const realId = mem[0].id;
    const now = new Date();
    const fechaPago = now.toISOString().split('T')[0];

    // 2. Calculate expiration
    let vencimiento = new Date();
    if (tipoMembresia === 'mensual') vencimiento.setMonth(vencimiento.getMonth() + 1);
    else if (tipoMembresia === 'semanal') vencimiento.setDate(vencimiento.getDate() + 7);
    else if (tipoMembresia === 'diaria') vencimiento.setDate(vencimiento.getDate() + 1);
    const fechaVencimiento = vencimiento.toISOString().split('T')[0];

    // 3. Insert payment
    const [result] = await db.query(
      'INSERT INTO payments (member_id, monto, tipoMembresia, fechaPago, fechaVencimiento, metodoPago, estado) VALUES (?,?,?,?,?,?,?)',
      [realId, monto, tipoMembresia, fechaPago, fechaVencimiento, metodoPago || 'efectivo', 'pagado']
    );

    // 4. Update/Insert membership record for sync
    await db.query(`
      INSERT INTO memberships (member_id, tipoMembresia, precio, fechaInicio, fechaVencimiento, estado)
      VALUES (?, ?, ?, ?, ?, 'activo')
      ON DUPLICATE KEY UPDATE 
        tipoMembresia = VALUES(tipoMembresia),
        precio = VALUES(precio),
        fechaVencimiento = VALUES(fechaVencimiento),
        estado = 'activo'
    `, [realId, tipoMembresia, monto, fechaPago, fechaVencimiento]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// --- Reports Endpoint ---
app.get('/api/reports', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);

    // 1. General Stats
    const [totalMembers] = await db.query('SELECT COUNT(*) as total FROM members');
    const [activeMembers] = await db.query('SELECT COUNT(*) as total FROM members WHERE estado = "activo"');
    const [attendanceToday] = await db.query('SELECT COUNT(*) as total FROM attendances WHERE fecha = ?', [today]);
    const [revenueMonth] = await db.query('SELECT SUM(monto) as total FROM payments WHERE estado = "pagado" AND fechaPago LIKE ?', [`${currentMonth}%`]);

    // Growth rate (members added this month vs total)
    const [newThisMonth] = await db.query('SELECT COUNT(*) as total FROM members WHERE fechaInicio LIKE ?', [`${currentMonth}%`]);
    const growthRate = totalMembers[0].total > 0 ? ((newThisMonth[0].total / totalMembers[0].total) * 100).toFixed(1) : 0;

    // 2. Attendance by weekday (Last 7 days)
    const [attendanceWeek] = await db.query(`
      SELECT DAYNAME(fecha) as dia, COUNT(*) as cantidad 
      FROM attendances 
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
      GROUP BY dia 
      ORDER BY FIELD(dia, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    `);

    const diasMap = { 'Monday': 'Lun', 'Tuesday': 'Mar', 'Wednesday': 'Mié', 'Thursday': 'Jue', 'Friday': 'Vie', 'Saturday': 'Sáb', 'Sunday': 'Dom' };
    const datosAsistencias = attendanceWeek.map(row => ({
      nombre: diasMap[row.dia] || row.dia,
      asistencias: row.cantidad
    }));

    // 3. Revenue by month (Last 6 months)
    const [revenue6Months] = await db.query(`
      SELECT DATE_FORMAT(fechaPago, '%Y-%m') as mes, SUM(monto) as total 
      FROM payments 
      WHERE estado = 'pagado' AND fechaPago >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY mes 
      ORDER BY mes ASC
    `);

    const mesesMap = { '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic' };
    const datosIngresos = revenue6Months.map(row => ({
      mes: mesesMap[row.mes.split('-')[1]],
      ingresos: row.total
    }));

    // 4. Membership Distribution
    const [membershipDist] = await db.query(`
      SELECT tipoMembresia, COUNT(*) as cantidad 
      FROM memberships 
      WHERE estado = 'activo' 
      GROUP BY tipoMembresia
    `);

    const colors = { 'mensual': '#3B82F6', 'semanal': '#10B981', 'diaria': '#F59E0B' };
    const datosMembresias = membershipDist.map(row => ({
      nombre: row.tipoMembresia.charAt(0).toUpperCase() + row.tipoMembresia.slice(1),
      valor: row.cantidad,
      color: colors[row.tipoMembresia] || '#8B5CF6'
    }));

    // 5. Active vs New Members (Last 6 months)
    // Simplified: fetching count of members starting each month
    const [newMembers6Months] = await db.query(`
      SELECT DATE_FORMAT(fechaInicio, '%Y-%m') as mes, COUNT(*) as cantidad 
      FROM members 
      WHERE fechaInicio >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY mes 
      ORDER BY mes ASC
    `);

    const datosMiembrosActivos = newMembers6Months.map(row => ({
      mes: mesesMap[row.mes.split('-')[1]],
      activos: activeMembers[0].total, // Cumulative approx
      nuevos: row.cantidad
    }));

    res.json({
      estadisticas: {
        totalMiembros: totalMembers[0].total,
        miembrosActivos: activeMembers[0].total,
        asistenciasHoy: attendanceToday[0].total,
        ingresosDelMes: revenueMonth[0].total || 0,
        pagosPendientes: 0, // Need debts table for this
        tasaCrecimiento: growthRate
      },
      datosAsistencias,
      datosIngresos,
      datosMembresias,
      datosMiembrosActivos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/dashboard/recent', async (req, res) => {
  try {
    const [recentAttendance] = await db.query(`
      SELECT a.*, m.nombre, m.codigo_miembro, m.avatar 
      FROM attendances a
      JOIN members m ON m.id = a.member_id
      ORDER BY a.fecha DESC, a.horaEntrada DESC
      LIMIT 5
    `);

    const today = new Date().toISOString().split('T')[0];
    const [upcomingExpirations] = await db.query(`
      SELECT m.nombre, mem.fechaVencimiento, mem.tipoMembresia, m.id as memberId
      FROM memberships mem
      JOIN members m ON m.id = mem.member_id
      WHERE mem.fechaVencimiento >= ?
      ORDER BY mem.fechaVencimiento ASC
      LIMIT 5
    `, [today]);

    res.json({
      recentAttendance,
      upcomingExpirations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Coach Stats Endpoint ---
app.get('/api/coach/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Total Clients (Members)
    const [clientsCount] = await db.query('SELECT COUNT(*) as total FROM members WHERE estado = "activo"');

    // 2. Sessions Today (Attendances)
    const [sessionsToday] = await db.query('SELECT COUNT(*) as total FROM attendances WHERE fecha = ?', [today]);

    // 3. Active Routines (Mocking for now as there's no routines table yet)
    // In a real scenario, this would query a 'routines' table
    const activeRoutines = 32;

    // 4. Attendance Rate (Simplified)
    const attendanceRate = 92;

    // 5. Recent Sessions
    const [recentSessions] = await db.query(`
      SELECT m.nombre as cliente, a.horaEntrada as hora, m.categoria as tipo, m.avatar
      FROM attendances a
      JOIN members m ON m.id = a.member_id
      WHERE a.fecha = ?
      ORDER BY a.horaEntrada DESC
      LIMIT 4
    `, [today]);

    res.json({
      stats: {
        totalClients: clientsCount[0].total,
        sessionsToday: sessionsToday[0].total,
        activeRoutines,
        attendanceRate
      },
      recentSessions: recentSessions.map(s => ({
        ...s,
        avatar: s.nombre.charAt(0)
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Auto-migrate column planAlimentacion
(async () => {
  try {
    await db.query('ALTER TABLE members ADD COLUMN planAlimentacion TEXT NULL');
  } catch (error) {
    // Column might already exist
  }
})();

// --- Coach Progress Endpoints ---
app.get('/api/coach/progress', async (req, res) => {
  try {
    const [members] = await db.query('SELECT m.id, m.nombre, m.edad, m.avatar, m.categoria, m.objetivo, m.fechaInicio, m.planAlimentacion FROM members m');
    const [progress] = await db.query('SELECT * FROM progress ORDER BY fecha ASC');
    const [measurements] = await db.query('SELECT * FROM measurements ORDER BY fecha DESC');
    const [attendances] = await db.query('SELECT member_id, COUNT(*) as count, MAX(fecha) as last_date FROM attendances GROUP BY member_id');

    const result = members.map(m => {
      const mProgress = progress.filter(p => p.member_id === m.id).map(p => ({
        fecha: p.fecha.toISOString().split('T')[0],
        peso: p.peso,
        masaMuscular: p.masaMuscular,
        grasaCorporal: p.grasaCorporal
      }));

      const mMeasurements = measurements.filter(meas => meas.member_id === m.id);
      const latestMeas = mMeasurements[0] || { pechoInicial: 0, pechoActual: 0, brazosInicial: 0, brazosActual: 0, cinturaInicial: 0, cinturaActual: 0, piernasInicial: 0, piernasActual: 0 };

      const mAtt = attendances.find(a => a.member_id === m.id);

      return {
        ...m,
        avatar: m.nombre.charAt(0).toUpperCase(),
        edad: m.edad || 25,
        sesionesCompletadas: mAtt ? mAtt.count : 0,
        ultimaSesion: mAtt ? mAtt.last_date : null,
        planAlimentacion: m.planAlimentacion ? JSON.parse(m.planAlimentacion) : null,
        progreso: {
          peso: mProgress.map(p => ({ fecha: p.fecha, valor: p.peso })),
          masaMuscular: mProgress.map(p => ({ fecha: p.fecha, valor: p.masaMuscular })),
          grasaCorporal: mProgress.map(p => ({ fecha: p.fecha, valor: p.grasaCorporal })),
          medidas: {
            pecho: { inicial: latestMeas.pechoInicial, actual: latestMeas.pechoActual },
            brazos: { inicial: latestMeas.brazosInicial, actual: latestMeas.brazosActual },
            cintura: { inicial: latestMeas.cinturaInicial, actual: latestMeas.cinturaActual },
            piernas: { inicial: latestMeas.piernasInicial, actual: latestMeas.piernasActual }
          }
        }
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/coach/progress/:id', async (req, res) => {
  const { id } = req.params;
  const { peso, masaMuscular, grasaCorporal, medidas } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Insert or update progress
    if (peso || masaMuscular || grasaCorporal) {
      await db.query(
        'INSERT INTO progress (member_id, fecha, peso, masaMuscular, grasaCorporal) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE peso=?, masaMuscular=?, grasaCorporal=?',
        [id, today, peso || 0, masaMuscular || 0, grasaCorporal || 0, peso || 0, masaMuscular || 0, grasaCorporal || 0]
      );
    }
    // Update measurements
    if (medidas) {
      // Find existing to use as "inicial"
      const [existing] = await db.query('SELECT * FROM measurements WHERE member_id=? ORDER BY fecha ASC LIMIT 1', [id]);

      const iniciales = existing.length > 0 ? {
        pecho: existing[0].pechoInicial || existing[0].pechoActual,
        brazos: existing[0].brazosInicial || existing[0].brazosActual,
        cintura: existing[0].cinturaInicial || existing[0].cinturaActual,
        piernas: existing[0].piernasInicial || existing[0].piernasActual
      } : medidas;

      await db.query(
        'INSERT INTO measurements (member_id, fecha, pechoInicial, pechoActual, brazosInicial, brazosActual, cinturaInicial, cinturaActual, piernasInicial, piernasActual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE pechoActual=?, brazosActual=?, cinturaActual=?, piernasActual=?',
        [id, today, iniciales.pecho, medidas.pecho, iniciales.brazos, medidas.brazos, iniciales.cintura, medidas.cintura, iniciales.piernas, medidas.piernas, medidas.pecho, medidas.brazos, medidas.cintura, medidas.piernas]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/coach/nutrition/:id', async (req, res) => {
  const { id } = req.params;
  const { planAlimentacion } = req.body;

  try {
    await db.query('UPDATE members SET planAlimentacion = ? WHERE id = ?', [JSON.stringify(planAlimentacion), id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Coach Routines Endpoints ---
app.get('/api/coach/routines', async (req, res) => {
  try {
    const [routines] = await db.query('SELECT * FROM routines ORDER BY id DESC');
    const [exercises] = await db.query('SELECT * FROM routine_exercises ORDER BY routine_id, orden');
    const [assignments] = await db.query('SELECT routine_id, COUNT(*) as count FROM member_routines GROUP BY routine_id');

    const result = routines.map(r => ({
      ...r,
      ejercicios: exercises.filter(e => e.routine_id === r.id),
      clientesAsignados: assignments.find(a => a.routine_id === r.id)?.count || 0
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/coach/routines', async (req, res) => {
  const { nombre, descripcion, categoria, duracion, ejercicios } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO routines (nombre, descripcion, categoria, duracion) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, categoria, duracion]
    );
    const routineId = result.insertId;

    if (ejercicios && ejercicios.length > 0) {
      for (let i = 0; i < ejercicios.length; i++) {
        const e = ejercicios[i];
        await db.query(
          'INSERT INTO routine_exercises (routine_id, nombre, series, repeticiones, descanso, orden) VALUES (?, ?, ?, ?, ?, ?)',
          [routineId, e.nombre, e.series, e.repeticiones, e.descanso, i]
        );
      }
    }

    res.json({ id: routineId, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.delete('/api/coach/routines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM routines WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/coach/assign-routine', async (req, res) => {
  const { member_id, routine_id } = req.body;
  try {
    // Optional: remove previous routine if you only want one active routine per member
    // await db.query('DELETE FROM member_routines WHERE member_id = ?', [member_id]);

    await db.query('INSERT INTO member_routines (member_id, routine_id) VALUES (?, ?)', [member_id, routine_id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// --- Member Endpoints ---
app.get('/api/member/dashboard/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [member] = await db.query('SELECT id, nombre, email, avatar, categoria, objetivo, fechaInicio FROM members WHERE id = ?', [id]);
    if (member.length === 0) return res.status(404).json({ error: 'member not found' });

    const [current] = await db.query('SELECT peso, masaMuscular, grasaCorporal FROM progress WHERE member_id = ? ORDER BY fecha DESC LIMIT 1', [id]);
    const [initial] = await db.query('SELECT peso, masaMuscular, grasaCorporal FROM progress WHERE member_id = ? ORDER BY fecha ASC LIMIT 1', [id]);
    const [sessions] = await db.query('SELECT COUNT(*) as total FROM attendances WHERE member_id = ?', [id]);
    const [sessionsWeek] = await db.query('SELECT COUNT(*) as total FROM attendances WHERE member_id = ? AND fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)', [id]);

    // Latest measurements
    const [meas] = await db.query('SELECT * FROM measurements WHERE member_id = ? ORDER BY fecha DESC LIMIT 1', [id]);
    const [initialMeas] = await db.query('SELECT * FROM measurements WHERE member_id = ? ORDER BY fecha ASC LIMIT 1', [id]);

    // Active routine
    const [routine] = await db.query(`
      SELECT r.* 
      FROM routines r
      JOIN member_routines mr ON mr.routine_id = r.id
      WHERE mr.member_id = ?
      LIMIT 1
    `, [id]);

    let exercises = [];
    if (routine.length > 0) {
      [exercises] = await db.query('SELECT * FROM routine_exercises WHERE routine_id = ? ORDER BY orden ASC', [routine[0].id]);
    }

    res.json({
      profile: member[0],
      stats: {
        pesoActual: current[0]?.peso || 0,
        pesoInicial: initial[0]?.peso || 0,
        masaActual: current[0]?.masaMuscular || 0,
        masaInicial: initial[0]?.masaMuscular || 0,
        grasaActual: current[0]?.grasaCorporal || 0,
        grasaInicial: initial[0]?.grasaCorporal || 0,
        sesionesTotal: sessions[0].total,
        sesionesSemana: sessionsWeek[0].total
      },
      medidas: meas[0] || null,
      medidasIniciales: initialMeas[0] || null,
      rutinaActual: routine.length > 0 ? { ...routine[0], ejercicios: exercises } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/member/progress/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [progress] = await db.query('SELECT * FROM progress WHERE member_id = ? ORDER BY fecha DESC', [id]);
    const [measurements] = await db.query('SELECT * FROM measurements WHERE member_id = ? ORDER BY fecha DESC', [id]);
    res.json({
      progress: progress.map(p => ({
        ...p,
        fecha: p.fecha.toISOString().split('T')[0]
      })),
      measurements: measurements.map(m => ({
        ...m,
        fecha: m.fecha.toISOString().split('T')[0]
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/member/nutrition/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await db.query('SELECT planAlimentacion FROM members WHERE id = ?', [id]);
    if (row.length === 0) return res.status(404).json({ error: 'member not found' });
    res.json(row[0].planAlimentacion ? JSON.parse(row[0].planAlimentacion) : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/member/routines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [routines] = await db.query(`
      SELECT r.* 
      FROM routines r
      JOIN member_routines mr ON mr.routine_id = r.id
      WHERE mr.member_id = ?
    `, [id]);

    const [exercises] = await db.query(`
      SELECT re.* 
      FROM routine_exercises re
      JOIN member_routines mr ON mr.routine_id = re.routine_id
      WHERE mr.member_id = ?
      ORDER BY re.routine_id, re.orden ASC
    `, [id]);

    const result = routines.map(r => ({
      ...r,
      ejercicios: exercises.filter(e => e.routine_id === r.id)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// serve static files from the Vite build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

// all other requests should return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await setupDatabase();
  await ensureAdmin();
});