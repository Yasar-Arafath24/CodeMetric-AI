import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

function Analytics() {
  return <h1>Analytics Page</h1>;
}

function Leaderboard() {
  return <h1>Leaderboard Page</h1>;
}

function Insights() {
  return <h1>AI Insights Page</h1>;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/leaderboard"
        element={<Leaderboard />}
      />

      <Route
        path="/insights"
        element={<Insights />}
      />
    </Routes>
  );
}

export default App;