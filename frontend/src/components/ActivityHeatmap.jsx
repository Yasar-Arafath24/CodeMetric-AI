import React, { useMemo } from "react";

function ActivityHeatmap({ commitsCount = 0 }) {
  // Generate a stable contribution grid for the last 24 weeks (7 days per week)
  const gridData = useMemo(() => {
    const rows = 7;
    const cols = 24;
    const totalDays = rows * cols;
    const data = [];

    // Simple seedable pseudo-random generator to make heatmap look stable but realistic
    let seed = commitsCount || 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Distribute commitsCount across the totalDays
    let commitsLeft = commitsCount;
    const dayCommits = Array(totalDays).fill(0);

    if (commitsLeft > 0) {
      // Allocate commits to random days to make it look realistic
      for (let i = 0; i < Math.min(commitsCount * 2, totalDays * 0.7); i++) {
        const dayIdx = Math.floor(random() * totalDays);
        const chunk = Math.min(Math.ceil(random() * 3), commitsLeft);
        dayCommits[dayIdx] += chunk;
        commitsLeft -= chunk;
        if (commitsLeft <= 0) break;
      }
      
      // If there are still commits left, distribute them
      let idx = 0;
      while (commitsLeft > 0) {
        dayCommits[idx % totalDays] += 1;
        commitsLeft -= 1;
        idx++;
      }
    }

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays);

    for (let c = 0; c < cols; c++) {
      const colDays = [];
      for (let r = 0; r < rows; r++) {
        const dayIndex = c * rows + r;
        const commitNum = dayCommits[dayIndex];
        
        // Calculate date for this cell
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + dayIndex);
        
        colDays.push({
          date: cellDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          commits: commitNum,
          level: commitNum === 0 ? 0 : commitNum <= 1 ? 1 : commitNum <= 3 ? 2 : commitNum <= 5 ? 3 : 4
        });
      }
      data.push(colDays);
    }
    return data;
  }, [commitsCount]);

  const getColor = (level) => {
    // Return green shades in light mode, indigo/blue in dark mode
    const isLight = document.body.classList.contains("light-mode");
    if (!isLight) {
      switch (level) {
        case 1: return "rgba(79, 140, 255, 0.25)";
        case 2: return "rgba(79, 140, 255, 0.5)";
        case 3: return "rgba(79, 140, 255, 0.75)";
        case 4: return "rgb(79, 140, 255)";
        default: return "rgba(255, 255, 255, 0.04)";
      }
    } else {

      switch (level) {
        case 1: return "#d1fae5";
        case 2: return "#6ee7b7";
        case 3: return "#34d399";
        case 4: return "#059669";
        default: return "rgba(0, 0, 0, 0.04)";
      }
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass-panel" style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <span style={{ fontSize: "20px" }}>📅</span>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
          Activity Heatmap
        </h3>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "auto" }}>
          Last 6 Months
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
        {/* Days label */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "105px", fontSize: "10px", color: "var(--text-muted)", paddingTarget: "20px" }}>
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: "flex", gap: "3px" }}>
          {gridData.map((col, colIdx) => (
            <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {col.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  title={`${day.commits} commits on ${day.date}`}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    backgroundColor: getColor(day.level),
                    cursor: "pointer",
                    transition: "var(--transition-smooth)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.3)";
                    e.currentTarget.style.zIndex = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.zIndex = "auto";
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", marginTop: "15px", fontSize: "11px", color: "var(--text-muted)" }}>
        <span>Less</span>
        <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: getColor(0) }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: getColor(1) }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: getColor(2) }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: getColor(3) }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: getColor(4) }} />
        <span>More</span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
