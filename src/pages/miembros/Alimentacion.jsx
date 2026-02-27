import { useState } from 'react';
import ClienteTopbar from '../../components/miembro/Topbar';
import ClienteSidebar from '../../components/miembro/Sidebar';
import Alimentacion from "../../components/miembro/Alimentacion";

const ClientePanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Topbar */}
      <ClienteTopbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Layout principal */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ClienteSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
        />
        
        {/* Contenido principal - Renderiza las rutas hijas */}
        <Alimentacion />
      </div>
    </div>
  );
};

export default ClientePanel;