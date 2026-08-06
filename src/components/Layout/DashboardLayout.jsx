import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="app-container">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <div className="main-wrapper">
        <Header
          onToggleSidebar={() => setCollapsed(!collapsed)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Yahan Dashboard, CustomerList, LoanApplication etc. render honge */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;