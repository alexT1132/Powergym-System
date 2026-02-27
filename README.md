# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Backend (Node.js + Express)

El código del servidor está aislado en la carpeta `backend/` para mantener la raíz limpia. Allí encontrarás:

- `backend/server.js` – servidor Express que entrega el build de React y ofrece APIs bajo `/api`.
- `backend/package.json` – dependencias y scripts del backend.

### Desarrollo

```bash
# instalar dependencias del frontend (en la raíz)
npm install

# instalar dependencias del backend
cd backend && npm install

# iniciar sólo la UI (hot reload con Vite)
npm run dev

# iniciar sólo el backend (usa la carpeta dist cuando quieras ver la versión compilada)
cd backend && npm start
# o desde la raíz:
npm run start:server
```

Vite se configura para enrutar automáticamente las peticiones a `/api` al servidor de Express durante el desarrollo gracias a la opción `proxy` en `vite.config.js`.

### Build y despliegue

```bash
npm run build        # genera el cliente en dist/
cd backend && npm start  # levanta express y sirve el contenido estático
```

Alternativamente puedes desplegar sólo los archivos estáticos en cualquier hosting estático (Netlify, Vercel, S3, etc.).

---

## Conexión a Base de Datos (MariaDB/MySQL)

El backend usa `mysql2` para comunicarse con una base de datos SQL. Durante el desarrollo puedes ejecutar un contenedor MariaDB (se proporciona uno en este workspace) o instalar MySQL en tu entorno.

**Variables de entorno** (usa `.env` en `backend/` o exporta en la shell):

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=powergym
```

Parámetros equivalentes si trabajas con otra base.

### Iniciar el contenedor MariaDB

```bash
docker run --name powergym-mariadb -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=powergym -p 3306:3306 -d mariadb:10.11
```

Una vez funcionando, ejecuta el script SQL:

```bash
cat database/schema.sql | docker exec -i powergym-mariadb mysql -uroot -proot powergym
```

### Endpoint de ejemplo

El servidor ya incluye una ruta en `backend/server.js` que consulta la tabla `members`:

```js
import db from './db.js';
app.get('/api/members', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM members');
  res.json(rows);
});
```

Puedes adaptar este patrón para crear APIs CRUD.

---
