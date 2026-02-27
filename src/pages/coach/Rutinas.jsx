import { useState } from 'react';
import CoachRutinas from "../../components/coach/Rutinas";
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
        <CoachRutinas />
      </div>
    </div>
  );
};

export default CoachPanel;