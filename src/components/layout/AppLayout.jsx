import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./layout.css";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="app-main">
        <Topbar
          currentPath={location.pathname}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;