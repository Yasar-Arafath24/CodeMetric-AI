import React from "react";

function RiskDeveloperPanel({ bottlenecks = [] }) {
  const getRiskBadgeStyles = (level) => {
    const lvl = level?.toLowerCase();
    if (lvl === "high") {
      return {
        color: "var(--risk-high)",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "1px solid rgba(239, 68, 68, 0.2)"
      };
    }
    if (lvl === "medium") {
      return {
        color: "var(--risk-medium)",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.2)"
      };
    }
    return {
      color: "var(--risk-low)",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "1px solid rgba(16, 185, 129, 0.2)"
    };
  };

  return (
    <div className="glass-panel" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <span style={{ fontSize: "20px" }}>⚠️</span>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
          Risk Developer Panel
        </h3>
        <span
          style={{
            marginLeft: "auto",
            background: "var(--border-glass)",
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "10px",
            color: "var(--text-muted)"
          }}
        >
          {bottlenecks.length} Alert{bottlenecks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {bottlenecks.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyItems: "center", padding: "20px 0" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", width: "100%" }}>
            ✅ No developer risk factors or bottlenecks detected.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxHeight: "360px",
            overflowY: "auto",
            paddingRight: "4px"
          }}
        >
          {bottlenecks.map((item, index) => {
            const badge = getRiskBadgeStyles(item.risk_level || "Medium");
            return (
              <div
                key={index}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(148, 163, 184, 0.04)",
                  border: "1px solid var(--border-glass)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                    {item.developer_name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      color: badge.color,
                      backgroundColor: badge.bg,
                      border: badge.border,
                      textTransform: "uppercase"
                    }}
                  >
                    {item.risk_level || "Medium"} Risk
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  <strong>Reason:</strong> {item.reason}
                </p>

                {item.recommendation && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      borderTop: "1px dashed var(--border-glass)",
                      paddingTop: "8px",
                      marginTop: "4px"
                    }}
                  >
                    💡 <strong>AI Rec:</strong> {item.recommendation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RiskDeveloperPanel;
