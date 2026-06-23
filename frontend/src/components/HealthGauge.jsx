function HealthGauge({ score }) {
  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine status color and text
  const getStatus = () => {
    if (score >= 80) return { text: "Healthy", color: "var(--risk-low)", bg: "rgba(34, 197, 94, 0.15)", trend: "↑ +2.5% vs last week" };
    if (score >= 60) return { text: "Good", color: "var(--risk-medium)", bg: "rgba(245, 158, 11, 0.15)", trend: "→ Steady" };
    return { text: "Attention Required", color: "var(--risk-high)", bg: "rgba(239, 68, 68, 0.15)", trend: "↓ -4.2% vs last week" };
  };

  const status = getStatus();

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        minWidth: "260px",
        flex: "1 1 260px",
      }}
    >
      {/* SVG Health Ring */}
      <div style={{ position: "relative", width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)" }}>
          {/* Background circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="transparent"
            stroke="var(--border-glass)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="transparent"
            stroke={status.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
        {/* Central percentage text */}
        <div style={{ position: "absolute", textAlign: "center" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            {score}%
          </span>
        </div>
      </div>

      {/* Health Text & Label */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>
          Repository Health
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "6px",
              color: status.color,
              backgroundColor: status.bg,
              fontSize: "11px",
              fontWeight: 600,
              textAlign: "center",
              width: "fit-content"
            }}
          >
            {status.text}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
            {status.trend}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HealthGauge;