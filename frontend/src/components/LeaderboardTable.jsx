import React, { useState } from "react";

function LeaderboardTable({ contributors = [], dpiScores = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("dpi");
  const [sortDirection, setSortDirection] = useState("desc");

  // Merge, rank, filter, and sort developer metrics
  const developersList = React.useMemo(() => {
    if (!contributors || contributors.length === 0) return [];
    
    // 1. Merge
    let list = contributors.map((dev) => {
      const dpiInfo = dpiScores.find(d => d.developer_name === dev.developer_name);
      const dpiVal = dpiInfo ? dpiInfo.dpi_score : 0;
      
      let category = "Low Performer";
      if (dpiVal >= 80) category = "High Performer";
      else if (dpiVal >= 50) category = "Average Performer";

      return {
        name: dev.developer_name,
        commits: dev.total_commits,
        dpi: dpiVal,
        category: category
      };
    });

    // 2. Sort by DPI to establish original ranks
    list.sort((a, b) => b.dpi - a.dpi || b.commits - a.commits);
    list = list.map((dev, idx) => ({ ...dev, originalRank: idx + 1 }));

    // 3. Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      list = list.filter(dev => dev.name.toLowerCase().includes(query));
    }

    // 4. Sort based on current field
    list.sort((a, b) => {
      let valA = a[sortField === "rank" ? "originalRank" : sortField];
      let valB = b[sortField === "rank" ? "originalRank" : sortField];

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Numeric comparison
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

    return list;
  }, [contributors, dpiScores, searchQuery, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to desc for metrics
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return " ⇅";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getCategoryStyles = (category) => {
    if (category === "High Performer") {
      return { color: "var(--risk-low)", bg: "rgba(34, 197, 94, 0.12)" };
    }
    if (category === "Average Performer") {
      return { color: "var(--risk-medium)", bg: "rgba(245, 158, 11, 0.12)" };
    }
    return { color: "var(--risk-high)", bg: "rgba(239, 68, 68, 0.12)" };
  };

  if (contributors.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: "center", padding: "30px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No developer ranking metrics available.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      {/* Header and Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🏆</span>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            Developer Rankings
          </h3>
        </div>

        <input
          type="text"
          placeholder="🔍 Search developers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 14px",
            fontSize: "13px",
            borderRadius: "8px",
            border: "1px solid var(--border-glass)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            outline: "none",
            width: "220px",
            transition: "var(--transition-smooth)"
          }}
        />
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("rank")}
                style={{ width: "95px", textAlign: "center", cursor: "pointer", userSelect: "none" }}
              >
                Rank{getSortIcon("rank")}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Developer{getSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("commits")}
                style={{ textAlign: "center", cursor: "pointer", userSelect: "none" }}
              >
                Commits{getSortIcon("commits")}
              </th>
              <th
                onClick={() => handleSort("dpi")}
                style={{ textAlign: "center", cursor: "pointer", userSelect: "none" }}
              >
                DPI Score{getSortIcon("dpi")}
              </th>
              <th style={{ userSelect: "none" }}>
                Performance Class
              </th>
            </tr>
          </thead>
          <tbody>
            {developersList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                  No developers matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              developersList.map((dev, index) => {
                const catStyle = getCategoryStyles(dev.category);
                return (
                  <tr key={index}>
                    <td style={{ textAlign: "center", fontWeight: 700, fontSize: dev.originalRank <= 3 ? "18px" : "14px" }}>
                      {getRankBadge(dev.originalRank)}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {dev.name}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 500 }}>
                      {dev.commits}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "var(--accent-light)" }}>
                      {dev.dpi}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: "6px",
                          color: catStyle.color,
                          backgroundColor: catStyle.bg,
                          display: "inline-block"
                        }}
                      >
                        {dev.category}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardTable;
