import db from './db.js';

async function seed() {
    try {
        console.log('🌱 Empezando el sembrado de datos (Seeding)...');

        // 1. Limpiar datos previos de tablas transaccionales para evitar duplicados molestos en reportes
        // (Opcional, pero ayuda a que los reportes se vean limpios)
        // await db.query('DELETE FROM payments');
        // await db.query('DELETE FROM attendances');
        // await db.query('DELETE FROM memberships');
        // await db.query('DELETE FROM members');

        // 2. Insertar Miembros adicionales
        console.log('👥 Insertando miembros...');
        const miembros = [
            ['089', 'Ana Martínez', 'ana@email.com', '5551234567', 'A', 25, 'cardio', '2024-01-02'],
            ['123', 'Carlos López', 'carlos@email.com', '5559876543', 'C', 30, 'fuerza', '2023-12-15'],
            ['067', 'Pedro Sánchez', 'pedro@email.com', '5556667777', 'P', 35, 'funcional', '2024-02-01'],
            ['034', 'Laura Torres', 'laura@email.com', '5553332222', 'L', 22, 'crossfit', '2024-02-10'],
            ['200', 'Miguel Angel', 'miguel@email.com', '5554445555', 'M', 28, 'fuerza', '2024-02-20']
        ];

        for (const m of miembros) {
            await db.query(`
        INSERT IGNORE INTO members (codigo_miembro, nombre, email, telefono, avatar, edad, categoria, fechaInicio, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'activo')
      `, m);
        }

        // Obtener IDs reales para relaciones
        const [membersRows] = await db.query('SELECT id, codigo_miembro FROM members');
        const memberMap = {};
        membersRows.forEach(row => memberMap[row.codigo_miembro] = row.id);

        // 3. Insertar Membresías
        console.log('💳 Insertando membresías...');
        const now = new Date();
        const future = new Date();
        future.setMonth(now.getMonth() + 1);

        const memberships = [
            [memberMap['089'], 'mensual', 1000, '2024-01-02', '2024-02-02', 'activo'],
            [memberMap['123'], 'mensual', 1000, '2023-12-15', '2024-01-15', 'vencido'],
            [memberMap['067'], 'semanal', 300, '2024-02-01', '2024-02-08', 'vencido'],
            [memberMap['034'], 'mensual', 1000, '2024-02-10', '2024-03-10', 'activo'],
            [memberMap['200'], 'diaria', 50, now.toISOString().split('T')[0], now.toISOString().split('T')[0], 'activo']
        ];

        for (const ms of memberships) {
            await db.query(`
        INSERT IGNORE INTO memberships (member_id, tipoMembresia, precio, fechaInicio, fechaVencimiento, estado)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ms);
        }

        // 4. Insertar Pagos (Historial para gráficas)
        console.log('💰 Generando historial de pagos...');
        const pagos = [
            [memberMap['001'], 1000, 'mensual', '2024-01-15', '2024-02-15', 'tarjeta'],
            [memberMap['045'], 300, 'semanal', '2024-01-10', '2024-01-17', 'efectivo'],
            [memberMap['089'], 1000, 'mensual', '2024-01-02', '2024-02-02', 'transferencia'],
            [memberMap['123'], 1000, 'mensual', '2023-12-15', '2024-01-15', 'efectivo'],
            [memberMap['123'], 1000, 'mensual', '2024-02-01', '2024-03-01', 'tarjeta'], // Pago de este mes
            [memberMap['067'], 300, 'semanal', '2024-02-05', '2024-02-12', 'efectivo'], // Pago de este mes
            [memberMap['034'], 1000, 'mensual', '2024-02-10', '2024-03-10', 'transferencia'], // Pago de este mes
            [memberMap['200'], 50, 'diaria', now.toISOString().split('T')[0], now.toISOString().split('T')[0], 'efectivo'] // Pago hoy
        ];

        for (const p of pagos) {
            await db.query(`
        INSERT IGNORE INTO payments (member_id, monto, tipoMembresia, fechaPago, fechaVencimiento, metodoPago, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'pagado')
      `, p);
        }

        // 5. Insertar Asistencias (Últimos 7 días)
        console.log('🏃 Generando asistencias recientes...');
        const days = 7;
        const memberIds = Object.values(memberMap);

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStr = date.toISOString().split('T')[0];

            // Asistencia aleatoria para cada día para 3-5 miembros
            const shuffled = memberIds.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);

            for (const mid of selected) {
                const hour = Math.floor(Math.random() * 12) + 7; // Entre 7 AM y 7 PM
                const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
                await db.query(`
                INSERT IGNORE INTO attendances (member_id, fecha, horaEntrada)
                VALUES (?, ?, ?)
            `, [mid, dayStr, timeStr]);
            }
        }

        console.log('✅ Base de datos poblada con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error en el seeding:', err);
        process.exit(1);
    }
}

seed();
