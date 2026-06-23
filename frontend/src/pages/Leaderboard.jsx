import { useOutletContext } from "react-router-dom";
import LeaderboardTable from "../components/LeaderboardTable";

function Leaderboard() {
  const { repoData } = useOutletContext();

  if (!repoData) {
    return (
      <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)", fontSize: "20px" }}>
          No repository data found. Please connect a public repository to view rankings.
        </h2>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <LeaderboardTable
        contributors={repoData.contributors}
        dpiScores={repoData.dpi_scores}
      />
    </div>
  );
}

export default Leaderboard;