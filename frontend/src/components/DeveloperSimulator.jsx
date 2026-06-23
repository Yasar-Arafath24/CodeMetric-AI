import React, { useState, useEffect, useMemo } from "react";

function DeveloperSimulator({ repoData }) {
  // Simulator Sliders State
  const [commitVelocity, setCommitVelocity] = useState(70);
  const [reviewDepth, setReviewDepth] = useState(60);
  const [bottleneckReduction, setBottleneckReduction] = useState(50);
  const [sprintDifficulty, setSprintDifficulty] = useState("medium"); // easy, medium, hard
  const [developerRoles, setDeveloperRoles] = useState({});

  // Initialize roles when repoData updates
  useEffect(() => {
    if (repoData?.contributors) {
      const initialRoles = {};
      repoData.contributors.forEach((c, idx) => {
        if (idx === 0) initialRoles[c.developer_name] = "Tech Lead";
        else if (idx === 1) initialRoles[c.developer_name] = "QA Engineer";
        else if (idx % 2 === 0) initialRoles[c.developer_name] = "Backend Developer";
        else initialRoles[c.developer_name] = "Frontend Developer";
      });
      setDeveloperRoles(initialRoles);
    }
  }, [repoData]);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I am your CodeMetric AI Synergy Assistant. I have loaded active developer profiles for "${repoData?.repository || 'React'}". Assign developer roles and tweak parameters to forecast your next sprint delivery!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  // Role modification helper
  const handleRoleChange = (developerName, newRole) => {
    setDeveloperRoles(prev => ({
      ...prev,
      [developerName]: newRole
    }));
  };

  // Perform dynamic real-time calculations
  const simResults = useMemo(() => {
    const rolesArray = Object.values(developerRoles);
    const leadCount = rolesArray.filter(r => r === "Tech Lead").length;
    const qaCount = rolesArray.filter(r => r === "QA Engineer").length;
    const backendCount = rolesArray.filter(r => r === "Backend Developer").length;
    const frontendCount = rolesArray.filter(r => r === "Frontend Developer").length;

    // 1. Calculate Sprint Success Rate
    let successRate = 65;
    successRate += (reviewDepth - 50) * 0.3;
    successRate += (bottleneckReduction - 50) * 0.25;
    successRate += (commitVelocity - 70) * 0.15;
    
    // Role bonuses
    successRate += leadCount * 6;
    successRate += qaCount * 8;
    successRate += Math.min(frontendCount, backendCount) * 4; // Balanced stack bonus

    // Difficulty penalties
    if (sprintDifficulty === "easy") successRate += 12;
    else if (sprintDifficulty === "hard") successRate -= 20;

    successRate = Math.min(99, Math.max(10, Math.round(successRate)));

    // 2. Calculate Team Stress Score
    let stressScore = 45;
    stressScore += (commitVelocity - 70) * 0.7;
    stressScore -= (bottleneckReduction - 50) * 0.4;
    stressScore -= (reviewDepth - 50) * 0.1; // Review depth slightly structures code but QA absorbs friction

    // Role impacts on stress
    stressScore += (frontendCount + backendCount) * 4;
    stressScore -= leadCount * 5;
    stressScore -= qaCount * 3;

    if (sprintDifficulty === "easy") stressScore -= 15;
    else if (sprintDifficulty === "hard") stressScore += 22;

    stressScore = Math.min(100, Math.max(5, Math.round(stressScore)));

    // 3. Calculate Defect Density (Bugs per 100 commits)
    let defectDensity = 4.8;
    defectDensity -= (reviewDepth - 50) * 0.05;
    defectDensity -= (bottleneckReduction - 50) * 0.02;
    defectDensity += (commitVelocity - 70) * 0.03;

    // Role impacts
    defectDensity -= qaCount * 0.8;
    defectDensity -= leadCount * 0.4;

    if (sprintDifficulty === "hard") defectDensity += 1.2;

    defectDensity = parseFloat(Math.min(9.5, Math.max(0.2, defectDensity)).toFixed(1));

    // 4. Generate AI Prescriptive Recommendations
    const recommendations = [];
    if (stressScore > 80) {
      recommendations.push({
        type: "danger",
        text: "⚠️ High Burn-out Risk: Reduce Commit Frequency or resolve active developer bottlenecks."
      });
    } else if (stressScore < 30 && commitVelocity < 50) {
      recommendations.push({
        type: "warning",
        text: "💤 Under-utilized capacity: Commit frequency is low. Consider raising speed targets."
      });
    }

    if (qaCount === 0) {
      recommendations.push({
        type: "warning",
        text: "🕵️ No QA Engineers assigned: Defect risk is higher. Promoted code review depth to 80% to compensate."
      });
    }

    if (leadCount === 0) {
      recommendations.push({
        type: "warning",
        text: "👑 No Tech Lead assigned: Synergy and architecture review quality may suffer."
      });
    }

    if (backendCount > frontendCount * 2) {
      recommendations.push({
        type: "info",
        text: "⚖️ Heavy Backend skew: Assign pair-programming reviews to avoid frontend integration blockers."
      });
    }

    if (defectDensity > 5) {
      recommendations.push({
        type: "danger",
        text: "🐛 High Defect Risk: Increase Code Review Depth or assign additional QA Engineers."
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "success",
        text: "✨ Balanced Sprint Plan: Team roles and sliders are well optimized. Proceed to board locking."
      });
    }

    return {
      successRate,
      stressScore,
      defectDensity,
      recommendations
    };
  }, [commitVelocity, reviewDepth, bottleneckReduction, sprintDifficulty, developerRoles]);

  const presetQuestions = [
    {
      q: "🔮 What is the delivery success prediction?",
      a: () => {
        return `Based on current settings, the Sprint Success Probability is ${simResults.successRate}%. ${
          simResults.successRate >= 80 
            ? "Your team is highly aligned for a successful release. QA coverage is solid and work is distributed." 
            : "Delivery risk is elevated. I recommend increasing Code Review Depth, ensuring a Tech Lead is active, or dropping the difficulty parameters."
        }`;
      }
    },
    {
      q: "📊 How does role assignment affect defect rates?",
      a: () => {
        return `Assigning a QA Engineer reduces predicted defect density (currently ${simResults.defectDensity} bugs/100 commits) by 0.8 units per engineer. A Tech Lead reduces it by 0.4 units. Code review depth is also a major multiplier for bug prevention.`;
      }
    },
    {
      q: "🔥 How do we reduce team burnout?",
      a: () => {
        return `Your Team Stress Score is ${simResults.stressScore}%. You can lower stress by: 1) Decreasing Commit Frequency targets. 2) Assigning a Tech Lead to distribute loads. 3) Reducing sprint goals to Easy or Medium.`;
      }
    }
  ];

  const handleQuestionClick = (qText, aFunc) => {
    if (isTyping) return;

    const userMsg = {
      sender: "user",
      text: qText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = {
        sender: "ai",
        text: aFunc(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCustomQuestionSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim() || isTyping) return;

    const qText = customQuestion;
    setCustomQuestion("");

    const userMsg = {
      sender: "user",
      text: qText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // AI custom answer mapping
    setTimeout(() => {
      let responseText = "";
      const query = qText.toLowerCase();

      if (query.includes("stress") || query.includes("burnout")) {
        responseText = `Current stress score is ${simResults.stressScore}%. Lower the Commit Frequency slider to decrease pressure, or add QA/Tech Lead roles to share architectural responsibilities.`;
      } else if (query.includes("bug") || query.includes("defect") || query.includes("error")) {
        responseText = `Defect density stands at ${simResults.defectDensity} bugs per 100 commits. Increasing Code Review Depth is the fastest way to drop defect rates.`;
      } else if (query.includes("role") || query.includes("synergy")) {
        responseText = `Assigning balanced roles (Frontend, Backend, QA, and Tech Lead) boosts delivery success probability by providing key checks on codebase velocity and pipeline code health.`;
      } else {
        responseText = `Analyzing sprint parameters: with a success probability of ${simResults.successRate}%, defect rate of ${simResults.defectDensity} bugs/100 commits, and stress index at ${simResults.stressScore}%, I advise locking this sprint config or pair-programming backend items.`;
      }

      const aiMsg = {
        sender: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const getStressColor = (score) => {
    if (score > 75) return "var(--risk-high)";
    if (score > 45) return "var(--risk-medium)";
    return "var(--risk-low)";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        marginTop: "10px"
      }}
    >
      <div
        className="simulator-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "25px",
          alignItems: "stretch"
        }}
      >
        {/* Left: Input Sandbox & Roles */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "20px" }}>🔮</span>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                AI Sprint & Team Synergy Planner
              </h3>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
              Simulate sprint delivery speed, developer stress, and defect metrics by adjusting team parameters and roles.
            </p>
          </div>

          {/* Sliders Grid */}
          <div className="simulator-sliders-grid" style={{ display: "grid", gap: "20px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span>Commit Frequency</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{commitVelocity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={commitVelocity}
                  onChange={(e) => setCommitVelocity(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span>Code Review Depth</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{reviewDepth}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={reviewDepth}
                  onChange={(e) => setReviewDepth(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span>Bottleneck Resolution</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{bottleneckReduction}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={bottleneckReduction}
                  onChange={(e) => setBottleneckReduction(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
                />
              </div>

              <div>
                <span style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Sprint Goal Difficulty
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSprintDifficulty(level)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "1px solid var(--border-glass)",
                        background: sprintDifficulty === level ? "var(--accent)" : "transparent",
                        color: sprintDifficulty === level ? "white" : "var(--text-secondary)",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "var(--transition-smooth)"
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team Role Assignee List */}
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "10px" }}>
              👥 Synergy Role Assignment
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto", paddingRight: "4px" }}>
              {repoData.contributors?.map((c) => (
                <div
                  key={c.developer_name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-glass)"
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    👤 {c.developer_name}
                  </span>
                  
                  <select
                    value={developerRoles[c.developer_name] || "Developer"}
                    onChange={(e) => handleRoleChange(c.developer_name, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "var(--bg-primary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-glass)",
                      fontSize: "12px",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Tech Lead">Tech Lead 👑</option>
                    <option value="Frontend Developer">Frontend Dev 🎨</option>
                    <option value="Backend Developer">Backend Dev ⚙️</option>
                    <option value="QA Engineer">QA Engineer 🕵️</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Outputs, Recommendations & Copilot Chat */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Simulation Output Cards */}
          <div className="glass-panel simulator-success-card" style={{ display: "grid", gap: "20px", alignItems: "center" }}>
            
            {/* Animated Circular success dial */}
            <div style={{ position: "relative", width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="45" cy="45" r="38" fill="transparent" stroke="var(--border-glass)" strokeWidth="6" />
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  fill="transparent"
                  stroke={simResults.successRate >= 80 ? "var(--risk-low)" : simResults.successRate >= 50 ? "var(--risk-medium)" : "var(--risk-high)"}
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 - (simResults.successRate / 100) * (2 * Math.PI * 38)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {simResults.successRate}%
                </span>
                <span style={{ display: "block", fontSize: "8px", color: "var(--text-muted)", textTransform: "uppercase" }}>Success</span>
              </div>
            </div>

            {/* Stress and defect density metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Team Stress Index</span>
                  <span style={{ fontWeight: 600, color: getStressColor(simResults.stressScore) }}>{simResults.stressScore}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--border-glass)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${simResults.stressScore}%`, height: "100%", background: getStressColor(simResults.stressScore), transition: "width 0.4s ease" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Defect Density Forecast</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: simResults.defectDensity > 5.0 ? "var(--risk-high)" : "var(--risk-low)", background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-glass)" }}>
                  🐛 {simResults.defectDensity} / 100 commits
                </span>
              </div>
            </div>
          </div>

          {/* AI Action Plan Warnings */}
          <div className="glass-panel" style={{ padding: "16px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
              💡 Prescriptive AI Action Plan
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {simResults.recommendations.map((rec, i) => {
                const getColors = () => {
                  if (rec.type === "danger") return { color: "var(--risk-high)", bg: "rgba(239,68,68,0.06)" };
                  if (rec.type === "warning") return { color: "var(--risk-medium)", bg: "rgba(245,158,11,0.06)" };
                  if (rec.type === "success") return { color: "var(--risk-low)", bg: "rgba(34,197,94,0.06)" };
                  return { color: "var(--accent)", bg: "rgba(79,140,255,0.06)" };
                };
                const themeColor = getColors();
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: "12.5px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      color: themeColor.color,
                      background: themeColor.bg,
                      border: `1px solid ${themeColor.color}15`,
                      lineHeight: "1.4"
                    }}
                  >
                    {rec.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Copilot Console */}
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "12px", height: "230px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>💬</span>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                Copilot Planning Chat
              </h3>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                background: "rgba(0, 0, 0, 0.12)",
                borderRadius: "8px"
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: msg.sender === "user" ? "var(--accent)" : "rgba(255, 255, 255, 0.05)",
                    color: "#ffffff",
                    fontSize: "12px",
                    lineHeight: "1.4"
                  }}
                >
                  {msg.text}
                  <div style={{ fontSize: "8px", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>
                    {msg.time}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: "flex-start", padding: "8px 12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.05)", fontSize: "12px", color: "var(--text-muted)" }}>
                  ⚡ Copilot is typing...
                </div>
              )}
            </div>

            {/* Presets / Custom Ask */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "2px" }}>
                {presetQuestions.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuestionClick(pq.q, pq.a)}
                    disabled={isTyping}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "1px solid var(--border-glass)",
                      color: "var(--text-secondary)",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                  >
                    {pq.q.split(" ").slice(0, 3).join(" ") + "..."}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCustomQuestionSubmit} style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Ask Copilot about synergy limits..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-glass)",
                    fontSize: "12.5px",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  className="btn-premium"
                  style={{ padding: "8px 14px", borderRadius: "6px", fontSize: "12.5px" }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .simulator-sliders-grid {
          grid-template-columns: 1fr 1fr;
        }
        .simulator-success-card {
          grid-template-columns: 100px 1fr;
        }
        @media (max-width: 900px) {
          .simulator-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .simulator-sliders-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
        }
        @media (max-width: 480px) {
          .simulator-success-card {
            grid-template-columns: 1fr !important;
            text-align: center;
            justify-items: center;
          }
          .simulator-success-card > div {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}

export default DeveloperSimulator;
