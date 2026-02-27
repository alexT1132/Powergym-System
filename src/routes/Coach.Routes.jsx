import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/coach/Dashboard";
import Clientes from "../pages/coach/Clientes";
import Progresos from "../pages/coach/Progresos";
import Rutinas from "../pages/coach/Rutinas";
import Configuracion from "../pages/coach/Configuraciones";

function recepcion() {
  return (
    <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="progreso" element={<Progresos />} />
        <Route path="rutinas" element={<Rutinas />} />
        <Route path="configuracion" element={<Configuracion />} />
    </Routes>
  )
}

export default recepcion;