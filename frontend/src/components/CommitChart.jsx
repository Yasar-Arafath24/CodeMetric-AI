import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function CommitChart({ data }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Developer Commits</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="developer_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_commits" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CommitChart;