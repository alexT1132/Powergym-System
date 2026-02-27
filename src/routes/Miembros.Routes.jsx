import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/miembros/Dashboard";
import Progresos from "../pages/miembros/Progresos";
import Rutinas from "../pages/miembros/Rutinas";
import Alimentacion from "../pages/miembros/Alimentacion";
import Configuracion from "../pages/miembros/Configuracion";

function recepcion() {
  return (
    <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="progreso" element={<Progresos />} />
        <Route path="rutinas" element={<Rutinas />} />
        <Route path="alimentacion" element={<Alimentacion />} />
        <Route path="configuracion" element={<Configuracion />} />
    </Routes>
  )
}

export default recepcion;