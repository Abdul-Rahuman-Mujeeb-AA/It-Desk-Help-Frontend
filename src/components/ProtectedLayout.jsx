import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main
        className="
          min-h-screen
          pt-16
          lg:ml-64
        "
      >
        <div
          className="
            w-full
            max-w-[1600px]
            mx-auto
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
