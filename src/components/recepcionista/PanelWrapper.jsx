import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const PanelWrapper = ({ children }) => {
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // derive active section from the third segment of the path (e.g. "/recepcion/miembros")
  const section = location.pathname.split('/')[2] || 'dashboard';
  const [activeSection, setActiveSection] = useState(section);

  useEffect(() => {
    setActiveSection(section);
    // close sidebar on small screens when path changes
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [section]);

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const handleSetActiveSection = (s) => setActiveSection(s);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen}
          setActiveSection={handleSetActiveSection}
          activeSection={activeSection}
        />

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PanelWrapper;
