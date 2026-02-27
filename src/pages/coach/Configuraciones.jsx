import { useState } from 'react';
import CoachConfig from "../../components/coach/Configuraciones";
import CoachTopbar from '../../components/coach/Topbar';
import CoachSidebar from '../../components/coach/Sidebar';

const CoachPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Topbar */}
      <CoachTopbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Layout principal */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <CoachSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
        />
        
        {/* Contenido principal - Renderiza las rutas hijas */}
        <CoachConfig />
      </div>
    </div>
  );
};

export default CoachPanel;