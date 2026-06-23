import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../api/api";
import { FaGithub, FaLinkedin, FaBars } from "react-icons/fa";

function DashboardLayout() {
  const [repos, setRepos] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState(() => {
    return Number(localStorage.getItem("selectedRepoId")) || 1;
  });
  const [repoData, setRepoData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // Mobile navigation state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Import Repo Modal/Form State
  const [showImportForm, setShowImportForm] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [importStatus, setImportStatus] = useState(""); // "", "connecting", "syncing", "metrics", "health", "dpi", "bottlenecks", "insights", "done"
  const [importProgress, setImportProgress] = useState(0);
  const [importError, setImportError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Dark/Light Mode side effect
  useEffect(() => {
    document.body.classList.remove("light-mode");
    if (theme === "light") {
      document.body.classList.add("light-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);


  // Fetch all repositories list
  const fetchReposList = async () => {
    try {
      const res = await api.get("/repositories/");
      setRepos(res.data || []);
      if (res.data && res.data.length > 0) {
        // If current selected ID is not in the list, default to the first one
        const exists = res.data.some(r => r.id === selectedRepoId);
        if (!exists) {
          setSelectedRepoId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching repositories:", err);
    }
  };

  useEffect(() => {
    fetchReposList();
  }, []);

  // Fetch active repository dashboard details
  useEffect(() => {
    if (!selectedRepoId) return;
    setLoadingData(true);
    localStorage.setItem("selectedRepoId", selectedRepoId);
    api.get(`/dashboard/${selectedRepoId}`)
      .then((res) => {
        if (res.data && !res.data.error) {
          setRepoData(res.data);
        } else {
          console.error("Error response from dashboard:", res.data?.error);
          setRepoData(null);
        }
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setRepoData(null);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [selectedRepoId]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  // Connect a public repository flow
  const handleImportRepository = async (e) => {
    e.preventDefault();
    setImportError("");
    
    // Parse GitHub URL
    const urlPattern = /github\.com\/([^/]+)\/([^/]+)/;
    const match = repoUrl.match(urlPattern);
    if (!match) {
      setImportError("Please enter a valid GitHub public repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    const ownerName = match[1];
    const repoName = match[2].replace(/\.git$/, "");

    try {
      // Step 1: Connect Repository
      setImportStatus("Connecting repository...");
      setImportProgress(10);
      const connectRes = await api.post("/repositories/connect", {
        repo_name: repoName,
        repo_url: repoUrl.trim(),
        owner_name: ownerName,
        project_id: 1 // Default Project ID
      });

      if (connectRes.data.message && connectRes.data.message.includes("already connected")) {
        // If already exists, we find it and switch to it
        setImportStatus("Repository already connected. Switching to it...");
        setImportProgress(100);
        
        // Find existing repo ID
        const allRepos = await api.get("/repositories/");
        const existing = allRepos.data.find(r => r.repo_url === repoUrl.trim());
        if (existing) {
          setSelectedRepoId(existing.id);
        }
        
        setTimeout(() => {
          setShowImportForm(false);
          setRepoUrl("");
          setImportStatus("");
          setImportProgress(0);
        }, 1500);
        return;
      }

      const newId = connectRes.data.repository_id;
      if (!newId) {
        throw new Error("Repository ID not returned from connect");
      }

      // Step 2: Sync Commits
      setImportStatus("Synchronizing commits from GitHub...");
      setImportProgress(30);
      await api.post(`/repositories/${newId}/sync-commits`);

      // Step 3: Generate Metrics
      setImportStatus("Analyzing commit history and developers...");
      setImportProgress(50);
      await api.post(`/repositories/${newId}/generate-metrics`);

      // Step 4: Generate Health
      setImportStatus("Calculating repository health score...");
      setImportProgress(65);
      await api.post(`/repositories/${newId}/generate-health`);

      // Step 5: Generate DPI
      setImportStatus("Computing Developer Productivity Index (DPI)...");
      setImportProgress(75);
      await api.post(`/repositories/${newId}/generate-dpi`);

      // Step 6: Generate Bottlenecks
      setImportStatus("Analyzing code bottlenecks and risks...");
      setImportProgress(85);
      await api.post(`/bottlenecks/${newId}/generate`);

      // Step 7: Generate AI Insights
      setImportStatus("Generating AI recommendations and summaries...");
      setImportProgress(95);
      await api.post(`/insights/${newId}/generate`);

      setImportStatus("Complete! Dashboard updated.");
      setImportProgress(100);

      // Refresh repositories list and switch to the new repository
      await fetchReposList();
      setSelectedRepoId(newId);

      setTimeout(() => {
        setShowImportForm(false);
        setRepoUrl("");
        setImportStatus("");
        setImportProgress(0);
      }, 1500);

    } catch (err) {
      console.error("Repository connection failed:", err);
      setImportError(err.response?.data?.message || err.message || "An error occurred during repository import.");
      setImportStatus("");
      setImportProgress(0);
    }
  };

  // Determine page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/analytics":
        return "Analytics";
      case "/leaderboard":
        return "Leaderboard";
      case "/insights":
        return "AI Insights";
      default:
        return "CodeMetric AI";
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Backdrop overlay for mobile sidebar */}
      <div
        className={`app-sidebar-overlay ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main-container">
        {/* Top Header Bar */}
        <header
          className="layout-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            paddingBottom: "15px",
            borderBottom: "1px solid var(--border-glass)",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="hamburger-toggle"
              onClick={() => setMobileOpen(true)}
              title="Open Sidebar Menu"
            >
              <FaBars />
            </button>
            <div>
              <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>
                {getPageTitle()}
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
                {repoData ? `Active Repo: ${repoData.repository} (${repoData.owner})` : "No active repository"}
              </p>
            </div>
          </div>

          {/* Repo Selector and Theme Toggle */}
          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            
            {/* Repository Dropdown Selector */}
            <div style={{ position: "relative" }}>
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(Number(e.target.value))}
                style={{
                  padding: "10px 36px 10px 16px",
                  fontSize: "14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-glass)",
                  background: "var(--bg-glass)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500,
                  outline: "none",
                  appearance: "none",
                  WebkitAppearance: "none",
                  transition: "var(--transition-smooth)",
                  boxShadow: "var(--shadow-premium)",
                }}
              >
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    📦 {repo.repo_name}
                  </option>
                ))}
              </select>
              <span style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                fontSize: "12px",
                color: "var(--text-muted)"
              }}>▼</span>
            </div>

            {/* Connect Public Repo Button */}
            <button
              onClick={() => setShowImportForm(true)}
              className="btn-premium"
              style={{ padding: "9px 16px", borderRadius: "10px" }}
            >
              📥 Connect Repo
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                border: "1px solid var(--border-glass)",
                background: "var(--bg-glass)",
                color: "var(--text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "var(--transition-smooth)",
                boxShadow: "var(--shadow-premium)"
              }}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>
          </div>
        </header>

        {/* Import Repo Modal overlay */}
        {showImportForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "30px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>Connect Public GitHub Repo</h3>
                {!importStatus && (
                  <button
                    onClick={() => setShowImportForm(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "24px",
                      color: "var(--text-secondary)",
                      cursor: "pointer"
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              {importStatus ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    border: "4px solid var(--border-glass)",
                    borderTop: "4px solid var(--accent)",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{importStatus}</p>
                  
                  {/* Progress bar */}
                  <div style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "var(--border-glass)",
                    borderRadius: "3px",
                    marginTop: "15px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${importProgress}%`,
                      height: "100%",
                      backgroundColor: "var(--accent)",
                      transition: "width 0.4s ease"
                    }} />
                  </div>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : (
                <form onSubmit={handleImportRepository}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      GitHub Repository URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/facebook/react"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-glass)",
                        background: "var(--bg-primary)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                  </div>

                  {importError && (
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "var(--risk-high)",
                      fontSize: "13px",
                      marginBottom: "20px"
                    }}>
                      ⚠️ {importError}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setShowImportForm(false)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-glass)",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-premium">
                      Sync & Connect
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Content Outlet with loading state */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {loadingData ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "3px solid var(--border-glass)",
                borderTop: "3px solid var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "15px"
              }} />
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading repository analysis...</p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <Outlet context={{ repoData, loadingData, fetchReposList, setSelectedRepoId, theme }} />
          )}
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "45px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-glass)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            color: "var(--text-muted)",
            fontSize: "13px",
            transition: "var(--transition-smooth)"
          }}
        >
          <div>
            <span>© {new Date().getFullYear()} CodeMetric AI. All rights reserved.</span>
            <span style={{ margin: "0 8px", color: "var(--border-glass)" }}>|</span>
            <span>Developed by <strong style={{ color: "var(--text-primary)" }}>Yasar Arafath M</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href="https://github.com/Yasar-Arafath24"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--text-muted)",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                transition: "var(--transition-smooth)",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              title="GitHub Profile"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/yasar-arafath-365490333/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--text-muted)",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                transition: "var(--transition-smooth)",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              title="LinkedIn Profile"
            >
              <FaLinkedin />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;
