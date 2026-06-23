function HealthGauge({ score }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        minWidth: "200px",
      }}
    >
      <h3>Health Score</h3>
      <h2>{score}%</h2>
    </div>
  );
}

export default HealthGauge;