import React from "react";

function TopPerformerCard({ contributors = [], dpiScores = [] }) {
  // Find top performer by highest DPI score
  const getTopPerformer = () => {
    if (!dpiScores || dpiScores.length === 0) {
      if (!contributors || contributors.length === 0) return null;
      // Fallback to highest commits if no DPI scores
      const sortedByCommits = [...contributors].sort((a, b) => b.total_commits - a.total_commits);
      return {
        name: sortedByCommits[0].developer_name,
        commits: sortedByCommits[0].total_commits,
        dpi: "N/A",
        label: "Top Contributor"
      };
    }

    const sortedByDpi = [...dpiScores].sort((a, b) => b.dpi_score - a.dpi_score);
    const topDpiDev = sortedByDpi[0];
    
    // Find commits for this developer
    const devCommits = contributors.find(c => c.developer_name === topDpiDev.developer_name);
    const commitsCount = devCommits ? devCommits.total_commits : 0;

    return {
      name: topDpiDev.developer_name,
      commits: commitsCount,
      dpi: topDpiDev.dpi_score,
      label: "Highest Productivity"
    };
  };

  const top = getTopPerformer();

  if (!top) {
    return (
      <div className="glass-panel" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No performance data available</p>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, var(--bg-glass) 100%)"
      }}
    >
      {/* Decorative crown bg */}
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          right: "-20px",
          fontSize: "120px",
          opacity: 0.04,
          pointerEvents: "none",
          transform: "rotate(-15deg)"
        }}
      >
        🏆
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
          <span style={{ fontSize: "20px" }}>🏆</span>
          <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Top Performer
          </span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px", letterSpacing: "-0.5px" }}>
          {top.name}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Commits:</span>
            <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)" }}>{top.commits}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>DPI Score:</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "var(--accent-light)",
                background: "var(--accent-glow)",
                padding: "2px 8px",
                borderRadius: "6px"
              }}
            >
              {top.dpi}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--risk-low)",
            background: "rgba(16, 185, 129, 0.12)"
          }}
        >
          ✨ {top.label}
        </span>
      </div>
    </div>
  );
}

export default TopPerformerCard;
