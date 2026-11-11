import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { Goals } from "./pages/Goals";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import "./styles/globals.css";

function App() {
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register" | "app"
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Auth screens ────────────────────────────────────────────────────────────
  if (authScreen === "login") {
    return (
      <Login
        onLogin={() => setAuthScreen("app")}
        onGoRegister={() => setAuthScreen("register")}
      />
    );
  }

  if (authScreen === "register") {
    return (
      <Register
        onRegister={() => setAuthScreen("app")}
        onGoLogin={() => setAuthScreen("login")}
      />
    );
  }

  // ── Main app ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F6F7F9' }}>
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={() => setAuthScreen("login")}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar userName="Arjun Mehta" onLogout={() => setAuthScreen("login")} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {activePage === "dashboard"    && <Dashboard />}
          {activePage === "transactions" && <Transactions />}
          {activePage === "budgets"      && <Budgets />}
          {activePage === "goals"        && <Goals />}
          {activePage === "import-export"&& <ImportExport />}
          {activePage === "settings"     && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;
