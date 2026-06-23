import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, ScatterChart, Scatter, LabelList
} from "recharts";
import CommitChart from "../components/CommitChart";
import DPIChart from "../components/DPIChart";

function Analytics() {
  const { repoData } = useOutletContext();
  const [selectedChartId, setSelectedChartId] = useState("commits_volume");

  if (!repoData) {
    return (
      <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-muted)", fontSize: "20px" }}>
          No repository data found. Please connect a public repository to view analytics.
        </h2>
      </div>
    );
  }

  // List of all 12 charts
  const chartsList = [
    { id: "commits_volume", name: "Contributor Commit Volume", icon: "📊", category: "Core Metrics", desc: "Total commits contributed by each developer in this repository." },
    { id: "dpi_standings", name: "DPI Score Standings", icon: "🔥", category: "Core Metrics", desc: "Developer Productivity Index (DPI) scores calculated from speed, quality, and health metrics." },
    { id: "weekly_velocity", name: "Weekly Commit Velocity", icon: "📈", category: "Trends", desc: "Weekly commit frequency showing team delivery pace." },
    { id: "hourly_rhythm", name: "Hourly Rhythm", icon: "🕒", category: "Trends", desc: "Diurnal rhythm of commits showing peak hours of coding activity." },
    { id: "code_churn", name: "Code Churn", icon: "🌱", category: "Trends", desc: "Code insertions vs deletions per contributor showing software instability." },
    { id: "pr_cycle", name: "PR Cycle Times", icon: "⏳", category: "Quality & Process", desc: "Average time in hours taken from PR opening to merging." },
    { id: "pr_approvals", name: "PR Approval Rates", icon: "✅", category: "Quality & Process", desc: "Ratios of instant approvals vs revisions vs rejections." },
    { id: "dpi_vector", name: "DPI Vector Profile", icon: "🕸️", category: "Core Metrics", desc: "Multi-dimensional performance profile measuring consistency, velocity, and health." },
    { id: "workload_share", name: "Workload Share", icon: "🍕", category: "Trends", desc: "Proportional contribution of commits per team member." },
    { id: "impact_map", name: "Developer Impact Map", icon: "🎯", category: "Core Metrics", desc: "Correlation between commit count and DPI score, highlighting high-leverage work." },
    { id: "risk_trends", name: "Risk Alert Trends", icon: "⚠️", category: "Quality & Process", desc: "Risk alerts generated per week based on codebase bottlenecks." },
    { id: "loc_growth", name: "LOC Growth Trend", icon: "💻", category: "Trends", desc: "Cumulative growth of Lines of Code (LOC) over the last 6 weeks." }
  ];

  const activeChart = chartsList.find(c => c.id === selectedChartId) || chartsList[0];

  // Derive stable simulated data based on active repository metrics for all 12 charts
  const chartsData = useMemo(() => {
    const devs = repoData.contributors || [];
    const dpis = repoData.dpi_scores || [];
    
    // Chart 1 & 2: Base contributors and DPI
    const baseCommits = devs;
    const baseDpis = dpis;

    // Chart 3: Weekly Commit Velocity (Line)
    const weeklyVelocity = [
      { week: "Wk 1", commits: Math.round(repoData.commits * 0.1) || 5 },
      { week: "Wk 2", commits: Math.round(repoData.commits * 0.15) || 8 },
      { week: "Wk 3", commits: Math.round(repoData.commits * 0.12) || 6 },
      { week: "Wk 4", commits: Math.round(repoData.commits * 0.22) || 12 },
      { week: "Wk 5", commits: Math.round(repoData.commits * 0.18) || 9 },
      { week: "Wk 6", commits: Math.round(repoData.commits * 0.23) || 14 },
    ];

    // Chart 4: Hourly Active Commit Rhythm (Bar)
    const hourlyRhythm = [
      { period: "Morning (6am-12pm)", commits: Math.round(repoData.commits * 0.25) || 15 },
      { period: "Afternoon (12pm-6pm)", commits: Math.round(repoData.commits * 0.45) || 28 },
      { period: "Evening (6pm-12am)", commits: Math.round(repoData.commits * 0.20) || 12 },
      { period: "Overnight (12am-6am)", commits: Math.round(repoData.commits * 0.10) || 5 },
    ];

    // Chart 5: Code Churn Analysis (Stacked Bar)
    const codeChurn = devs.map((d, i) => ({
      name: d.developer_name,
      additions: d.total_commits * 120 + 200,
      deletions: d.total_commits * 45 + 50
    }));

    // Chart 6: PR Cycle Times (Area)
    const prCycleTimes = [
      { day: "Mon", hours: 14 },
      { day: "Tue", hours: 22 },
      { day: "Wed", hours: 18 },
      { day: "Thu", hours: 12 },
      { day: "Fri", hours: 28 },
      { day: "Sat", hours: 8 },
      { day: "Sun", hours: 5 },
    ];

    // Chart 7: PR Approval Rates (Pie)
    const prApprovalRates = [
      { name: "Approved Instantly", value: Math.round(repoData.commits * 0.6) || 30, color: "var(--risk-low)" },
      { name: "Requires Revision", value: Math.round(repoData.commits * 0.3) || 15, color: "var(--risk-medium)" },
      { name: "Rejected", value: Math.max(1, Math.round(repoData.commits * 0.1)) || 5, color: "var(--risk-high)" },
    ];

    // Chart 8: DPI Vector Profile (Radar)
    const radarData = [
      { subject: "Consistency", A: 85, B: 60, fullMark: 100 },
      { subject: "Velocity", A: 75, B: 90, fullMark: 100 },
      { subject: "Health score", A: repoData.health_score || 80, B: 70, fullMark: 100 },
      { subject: "PR Quality", A: 90, B: 50, fullMark: 100 },
      { subject: "Dispersal", A: 65, B: 85, fullMark: 100 },
    ];

    // Chart 9: Developer Activity Share (Pie)
    const activityShare = devs.map(d => ({
      name: d.developer_name,
      value: d.total_commits
    }));

    // Chart 10: Impact Map (Scatter)
    const scatterData = devs.map(d => {
      const dpiInfo = dpis.find(dpi => dpi.developer_name === d.developer_name);
      return {
        name: d.developer_name,
        commits: d.total_commits,
        dpi: dpiInfo ? dpiInfo.dpi_score : 50
      };
    });

    // Chart 11: Risk Alert Density (Area)
    const riskAlertDensity = [
      { day: "Week 1", alerts: 8 },
      { day: "Week 2", alerts: 6 },
      { day: "Week 3", alerts: 11 },
      { day: "Week 4", alerts: 5 },
      { day: "Week 5", alerts: 4 },
      { day: "Week 6", alerts: repoData.bottlenecks?.length || 2 },
    ];

    // Chart 12: Cumulative LOC Growth (Line)
    const locGrowth = [
      { week: "Week 1", loc: Math.round(repoData.commits * 12 + 1500) },
      { week: "Week 2", loc: Math.round(repoData.commits * 28 + 2200) },
      { week: "Week 3", loc: Math.round(repoData.commits * 48 + 3100) },
      { week: "Week 4", loc: Math.round(repoData.commits * 70 + 4000) },
      { week: "Week 5", loc: Math.round(repoData.commits * 92 + 5500) },
      { week: "Week 6", loc: Math.round(repoData.commits * 120 + 7200) },
    ];

    return {
      baseCommits, baseDpis, weeklyVelocity, hourlyRhythm, codeChurn, prCycleTimes,
      prApprovalRates, radarData, activityShare, scatterData, riskAlertDensity, locGrowth
    };
  }, [repoData]);

  const PIE_COLORS = ["#4F8CFF", "#818cf8", "#a855f7", "#ec4899", "#10b981", "#f59e0b"];

  const renderActiveChart = () => {
    switch (selectedChartId) {
      case "commits_volume":
        return <CommitChart data={chartsData.baseCommits} />;
      case "dpi_standings":
        return <DPIChart data={chartsData.baseDpis} />;
      case "weekly_velocity":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartsData.weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Line type="monotone" dataKey="commits" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "hourly_rhythm":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartsData.hourlyRhythm} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Bar dataKey="commits" fill="var(--risk-low)" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "code_churn":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartsData.codeChurn} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Bar dataKey="additions" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} />
              <Bar dataKey="deletions" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pr_cycle":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartsData.prCycleTimes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--risk-medium)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--risk-medium)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Area type="monotone" dataKey="hours" stroke="var(--risk-medium)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pr_approvals":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={chartsData.prApprovalRates} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" nameKey="name">
                {chartsData.prApprovalRates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case "dpi_vector":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart outerRadius={90} data={chartsData.radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <PolarGrid stroke="var(--border-glass)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" fontSize={10} />
              <Radar name="Active repo" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
              <Radar name="Target benchmark" dataKey="B" stroke="var(--text-muted)" fill="var(--text-muted)" fillOpacity={0.1} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case "workload_share":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={chartsData.activityShare} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value" nameKey="name">
                {chartsData.activityShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case "impact_map":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" />
              <XAxis type="number" dataKey="commits" name="commits" unit=" commits" stroke="var(--text-muted)" fontSize={12} />
              <YAxis type="number" dataKey="dpi" name="DPI" unit=" DPI" stroke="var(--text-muted)" fontSize={12} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Scatter name="Developers" data={chartsData.scatterData} fill="var(--accent)">
                <LabelList dataKey="name" position="top" style={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "risk_trends":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartsData.riskAlertDensity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--risk-high)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--risk-high)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Area type="monotone" dataKey="alerts" stroke="var(--risk-high)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAlerts)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "loc_growth":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartsData.locGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-glass)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-glass)", borderColor: "var(--border-glass)", color: "var(--text-primary)" }} />
              <Line type="monotone" dataKey="loc" stroke="#34D399" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Group charts by category
  const categories = ["Core Metrics", "Trends", "Quality & Process"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Mobile Selector Dropdown */}
      <div className="mobile-chart-select" style={{ display: "none", marginBottom: "15px" }}>
        <label style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "6px", fontWeight: 500 }}>
          Select Visualization:
        </label>
        <select
          value={selectedChartId}
          onChange={(e) => setSelectedChartId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "var(--bg-glass)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-glass)",
            fontSize: "14px",
            fontWeight: 500,
            outline: "none"
          }}
        >
          {chartsList.map(c => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className="analytics-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "25px",
          alignItems: "start"
        }}
      >
        {/* Left Visualizations Sidebar (Desktop) */}
        <div
          className="analytics-sidebar-pane glass-panel"
          style={{
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: "15px", fontWeight: 600, borderBottom: "1px solid var(--border-glass)", paddingBottom: "12px" }}>
            📈 Visualizations
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {categories.map(cat => (
              <div key={cat} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                  {cat}
                </span>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {chartsList.filter(c => c.category === cat).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChartId(c.id)}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid transparent",
                        background: selectedChartId === c.id ? "var(--accent-glow)" : "transparent",
                        color: selectedChartId === c.id ? "var(--accent)" : "var(--text-secondary)",
                        fontSize: "13px",
                        fontWeight: selectedChartId === c.id ? 600 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        transition: "var(--transition-smooth)"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChartId !== c.id) {
                          e.currentTarget.style.color = "var(--text-primary)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChartId !== c.id) {
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>{c.icon}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Visualization Display */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "460px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "22px" }}>{activeChart.icon}</span>
              <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                {activeChart.name}
              </h2>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0, lineHeight: "1.5" }}>
              {activeChart.desc}
            </p>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "rgba(0, 0, 0, 0.1)",
              border: "1px solid var(--border-glass)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "340px"
            }}
          >
            {renderActiveChart()}
          </div>
        </div>
      </div>
      
      {/* CSS overrides to handle responsiveness cleanly */}
      <style>{`
        @media (max-width: 900px) {
          .analytics-layout {
            grid-template-columns: 1fr !important;
          }
          .analytics-sidebar-pane {
            display: none !important;
          }
          .mobile-chart-select {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Analytics;
