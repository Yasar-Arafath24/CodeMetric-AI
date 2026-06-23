function StatsCard({ title, value, icon, color }) {
  // Determine default icon and color if not provided
  const getIcon = () => {
    if (icon) return icon;
    if (title.toLowerCase().includes("commit")) return "💻";
    if (title.toLowerCase().includes("developer")) return "👥";
    return "⚡";
  };

  const getGradient = () => {
    if (color === "blue") return "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
    if (color === "indigo") return "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)";
    if (color === "purple") return "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)";
    return "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)";
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "240px",
        flex: "1 1 240px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative colored glow in background */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: getGradient(),
          opacity: 0.08,
          filter: "blur(20px)",
          pointerEvents: "none"
        }}
      />

      <div>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>
          {title}
        </span>
        <h2 style={{ fontSize: "32px", fontWeight: 700, marginTop: "6px", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          {value}
        </h2>
      </div>

      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: getGradient(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          color: "white",
          boxShadow: "0 8px 16px -4px rgba(79, 70, 229, 0.2)"
        }}
      >
        {getIcon()}
      </div>
    </div>
  );
}

export default StatsCard;