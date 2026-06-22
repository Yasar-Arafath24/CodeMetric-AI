import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh"
      }}
    >
      <h3>CodeMetric AI</h3>

      <hr />

      <div className="d-flex flex-column gap-3">

        <Link
          to="/dashboard"
          className="text-white text-decoration-none"
        >
          Dashboard
        </Link>

        <Link
          to="/analytics"
          className="text-white text-decoration-none"
        >
          Analytics
        </Link>

        <Link
          to="/leaderboard"
          className="text-white text-decoration-none"
        >
          Leaderboard
        </Link>

        <Link
          to="/insights"
          className="text-white text-decoration-none"
        >
          AI Insights
        </Link>

      </div>
    </div>
  );
}

export default Sidebar;