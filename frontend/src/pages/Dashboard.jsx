import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container mt-4">
        <h1>
          CodeMetric AI Dashboard
        </h1>

        <p>
          Backend successfully connected.
        </p>
      </div>

    </div>
  );
}

export default Dashboard;