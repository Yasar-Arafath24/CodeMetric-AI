import { useOutletContext } from "react-router-dom";
import AIExecutiveSummary from "../components/AIExecutiveSummary";

function Insights() {
  const { repoData } = useOutletContext();

  if (!repoData) {
    return (
      <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)", fontSize: "20px" }}>
          No repository data found. Please connect a public repository to view insights.
        </h2>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Overview Executive brief */}
      <AIExecutiveSummary insights={repoData.ai_insights || []} />

      {/* Detailed Insights list */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>💡</span>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            Developer Recommendations
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {repoData.ai_insights?.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(148, 163, 184, 0.04)",
                border: "1px solid var(--border-glass)"
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "var(--text-primary)", fontWeight: 600 }}>
                👤 {item.developer_name}
              </h4>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                {item.insight}
              </p>
              {item.created_at && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Analysis computed: {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Insights;