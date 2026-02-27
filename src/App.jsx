import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RutasPublicas from "./routes/Web.Routes";
import Recepcionista from "./routes/Recepcion.Routes";
import CoachRoutes from "./routes/Coach.Routes";
import MiembrosRoutes from "./routes/Miembros.Routes";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RutasPublicas />} />
          <Route
            path="/recepcion/*"
            element={
              <ProtectedRoute roles={["recepcionista","admin"]}>
                <Recepcionista />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/*"
            element={
              <ProtectedRoute roles={["coach","admin"]}>
                <CoachRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/*"
            element={
              <ProtectedRoute roles={["miembro","admin"]}>
                <MiembrosRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;