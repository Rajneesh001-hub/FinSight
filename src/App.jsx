import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { Goals } from "./pages/Goals";
import "./styles/globals.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F6F7F9' }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <TopBar userName="Arjun Mehta" />

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "transactions" && <Transactions />}
          {activePage === "budgets" && <Budgets />}
          {activePage === "goals" && <Goals />}
        </main>
      </div>
    </div>
  );
}

export default App;
