import { useEffect, useState } from "react";
import api from "../api/api";

import CommitChart from "../components/CommitChart";
import StatsCard from "../components/StatsCard";
import HealthGauge from "../components/HealthGauge";
import DPIChart from "../components/DPIChart";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/1")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      });
  }, []);

  if (!data) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          overflowX: "auto",
        }}
      >
        <h1>🚀 CodeMetric AI Dashboard</h1>

        <hr />

        <h2>{data.repository}</h2>

        <p>
          <strong>Owner:</strong> {data.owner}
        </p>

        <p>
          <strong>Repository URL:</strong>{" "}
          <a
            href={data.repo_url}
            target="_blank"
            rel="noreferrer"
          >
            {data.repo_url}
          </a>
        </p>

        <hr />

        {/* KPI CARDS */}

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <StatsCard
            title="Total Commits"
            value={data.commits}
          />

          <StatsCard
            title="Developers"
            value={data.developers}
          />

          <HealthGauge
            score={data.health_score}
          />
        </div>

        <hr />

        {/* COMMIT CHART */}

        <h2>📊 Top Contributors</h2>

        <CommitChart
          data={data.contributors || []}
        />

        <hr />

        {/* DPI CHART */}

        <h2>🔥 Developer Productivity Index</h2>

        <DPIChart
          data={data.dpi_scores || []}
        />

        <hr />

        {/* CONTRIBUTORS TABLE */}

        <h2>👨‍💻 Contributor Details</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th>Developer</th>
              <th>Total Commits</th>
            </tr>
          </thead>

          <tbody>
            {data.contributors?.map((dev, index) => (
              <tr key={index}>
                <td>{dev.developer_name}</td>
                <td>{dev.total_commits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {/* DPI TABLE */}

        <h2>📈 DPI Scores</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th>Developer</th>
              <th>DPI Score</th>
            </tr>
          </thead>

          <tbody>
            {data.dpi_scores?.map((dpi, index) => (
              <tr key={index}>
                <td>{dpi.developer_name}</td>
                <td>{dpi.dpi_score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {/* BOTTLENECKS */}

        <h2>⚠️ Bottlenecks</h2>

        {data.bottlenecks?.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff3cd",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>{item.developer_name}</strong>
            <br />
            {item.reason}
          </div>
        ))}

        <hr />

        {/* AI INSIGHTS */}

        <h2>🤖 AI Insights</h2>

        {data.ai_insights?.map((insight, index) => (
          <div
            key={index}
            style={{
              background: "#e7f5ff",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>
              {insight.developer_name}
            </strong>

            <p>{insight.insight}</p>

            <small>
              {insight.created_at}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;