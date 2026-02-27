import { useState } from 'react';
import Topbar from '../../components/recepcionista/Topbar';
import Sidebar from '../../components/recepcionista/Sidebar';
import MiembrosContent from '../../components/recepcionista/Miembros';

const RecepcionPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    // Cerrar sidebar en móvil al cambiar de sección
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Layout principal */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setActiveSection={handleSetActiveSection}
          activeSection={activeSection}
        />
        
        {/* Contenido principal */}
        <MiembrosContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default RecepcionPanel;