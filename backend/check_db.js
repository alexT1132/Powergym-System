import db from './db.js';

async function check() {
    try {
        const [members] = await db.query('SELECT COUNT(*) as count FROM members');
        const [payments] = await db.query('SELECT COUNT(*) as count FROM payments');
        const [attendances] = await db.query('SELECT COUNT(*) as count FROM attendances');
        console.log('Members:', members[0].count);
        console.log('Payments:', payments[0].count);
        console.log('Attendances:', attendances[0].count);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
