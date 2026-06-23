function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}
    >
      <h2>🚀 CodeMetric AI</h2>

      <hr />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <div>📊 Dashboard</div>

        <div>📈 Analytics</div>

        <div>🏆 Leaderboard</div>

        <div>🤖 AI Insights</div>
      </div>
    </div>
  );
}

export default Sidebar;