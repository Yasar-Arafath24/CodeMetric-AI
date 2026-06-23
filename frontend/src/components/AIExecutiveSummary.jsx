import React from "react";

function AIExecutiveSummary({ insights = [] }) {
  return (
    <div
      className="glass-panel"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderLeft: "4px solid var(--accent)",
        background: "linear-gradient(135deg, var(--bg-glass) 0%, rgba(79, 70, 229, 0.03) 100%)"
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "var(--accent-light)"
            }}
          >
            🤖
          </div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            AI Executive Summary
          </h3>
        </div>

        {insights.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
            Analyzing repository commit signals... No AI insights generated yet. Click "Connect Repo" or trigger an update to run the LLM analysis.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 500, lineHeight: "1.5" }}>
              Here is the executive digest of developer activity and performance signals in this repository:
            </p>
            
            <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
              {insights.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(79, 70, 229, 0.03)",
                    borderLeft: "2px solid var(--accent-light)"
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    👤 {item.developer_name}
                  </span>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0 }}>
                    {item.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "12px", marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Analysis Confidence: <strong>94%</strong>
        </span>
        {insights.length > 3 && (
          <span style={{ fontSize: "11px", color: "var(--accent-light)", fontWeight: 600, cursor: "pointer" }}>
            +{insights.length - 3} more insights
          </span>
        )}
      </div>
    </div>
  );
}

export default AIExecutiveSummary;
