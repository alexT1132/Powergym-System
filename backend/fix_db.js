import db from './db.js';

async function fix() {
    try {
        console.log('Creating payments table...');
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
        console.log('Table payments ensured.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
}

fix();
