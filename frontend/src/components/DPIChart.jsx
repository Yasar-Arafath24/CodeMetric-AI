import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function DPIChart({ data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px"
      }}
    >
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="developer_name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="dpi_score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DPIChart;