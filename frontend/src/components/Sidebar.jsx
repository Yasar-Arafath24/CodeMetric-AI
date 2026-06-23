import { NavLink } from "react-router-dom";
import Logo from "./Logo";

function Sidebar() {
  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { path: "/insights", label: "AI Insights", icon: "🤖" }
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "var(--bg-sidebar)",
        color: "var(--text-sidebar)",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--border-glass)",
        transition: "var(--transition-smooth)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "35px" }}>
        <Logo size={32} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.5px" }}>
          CodeMetric AI
        </h2>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: isActive ? "var(--text-sidebar-active)" : "var(--text-sidebar)",
              background: isActive ? "var(--accent-glow)" : "transparent",
              borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
              transition: "var(--transition-smooth)"
            })}
          >
            <span style={{ fontSize: "16px" }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;