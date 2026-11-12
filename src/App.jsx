import React, { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";
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
  const [session, setSession] = useState(null);
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register" | "app"
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        setAuthScreen("app");
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          setAuthScreen("app");
        } else {
          setUser(null);
          setAuthScreen("login");
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleResize = () => setIsMobile(window.innerWidth < 1024);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setAuthScreen("login");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: "18px", color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
        Loading FinSight...
      </div>
    );
  }

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
        onLogout={handleLogout}
        userName={user?.user_metadata?.full_name || user?.email || "User"}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar userName={user?.user_metadata?.full_name || user?.email || "User"} onLogout={handleLogout} />
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
