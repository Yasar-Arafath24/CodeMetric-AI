import { useOutletContext } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import HealthGauge from "../components/HealthGauge";
import TopPerformerCard from "../components/TopPerformerCard";
import RiskDeveloperPanel from "../components/RiskDeveloperPanel";
import AIExecutiveSummary from "../components/AIExecutiveSummary";
import ActivityHeatmap from "../components/ActivityHeatmap";
import LeaderboardTable from "../components/LeaderboardTable";
import DeveloperSimulator from "../components/DeveloperSimulator";

function Dashboard() {
  const { repoData } = useOutletContext();

  if (!repoData) {
    return (
      <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)", fontSize: "20px" }}>
          No repository data found. Please connect a public repository to start monitoring.
        </h2>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* SECTION 1: KPI Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px"
        }}
      >
        <StatsCard
          title="Total Commits"
          value={repoData.commits}
          icon="💻"
          color="indigo"
        />

        <StatsCard
          title="Developers"
          value={repoData.developers}
          icon="👥"
          color="purple"
        />

        <HealthGauge
          score={repoData.health_score}
        />

        <TopPerformerCard
          contributors={repoData.contributors}
          dpiScores={repoData.dpi_scores}
        />
      </section>

      {/* SECTION 2: AI Summary & Risk Panel */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "25px",
          alignItems: "stretch"
        }}
      >
        <AIExecutiveSummary
          insights={repoData.ai_insights}
        />

        <RiskDeveloperPanel
          bottlenecks={repoData.bottlenecks}
        />
      </section>

      {/* SECTION 3: Heatmap */}
      <section>
        <ActivityHeatmap
          commitsCount={repoData.commits}
        />
      </section>

      {/* SECTION 3.5: AI Metric Simulator & Copilot (Unique Feature) */}
      <section>
        <DeveloperSimulator repoData={repoData} />
      </section>

      {/* SECTION 4: Developer Rankings */}
      <section>
        <LeaderboardTable
          contributors={repoData.contributors}
          dpiScores={repoData.dpi_scores}
        />
      </section>
    </div>
  );
}

export default Dashboard;
