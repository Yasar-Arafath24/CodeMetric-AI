function StatsCard({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        minWidth: "200px",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

export default StatsCard;