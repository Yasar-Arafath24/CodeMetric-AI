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
        height: "320px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="developer_name"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-glass)",
              borderColor: "var(--border-glass)",
              borderRadius: "8px",
              color: "var(--text-primary)"
            }}
          />
          <Bar
            dataKey="dpi_score"
            fill="var(--accent-light)"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DPIChart;