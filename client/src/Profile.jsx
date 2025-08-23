import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_USER, BASE_API_URL } from "./components/UserInfo.js";

function Profile() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const init = {
      method: "GET",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };
    fetch(`${BASE_API_URL}/user/log/me`, init)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(`Error fetching logs: ${r.status}`)
      )
      .then((data) => setLogs(data || []))
      .catch((err) => {
        console.error(err);
        setErrors(["Could not fetch logs."]);
      });
  }, []);

  function handleDelete(logId) {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    const init = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };

    fetch(`${BASE_API_URL}/user/log/${logId}`, init)
      .then((r) => (r.ok ? null : Promise.reject("Failed to delete log.")))
      .then(() => setLogs((prev) => prev.filter((l) => l.logId !== logId)))
      .catch((err) => {
        console.error(err);
        setErrors(["Could not delete log."]);
      });
  }

  return (
    <section className="container mt-5">
      <h2 className="app-title text-center mb-4">Your Logs</h2>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {logs.length === 0 ? (
        <p className="p2 bg-white text-dark px-2 py-1 d-inline-block rounded shadow-sm">
          No logs found. <Link to="/log/add">Add your first log</Link>
        </p>
      ) : (
        <div className="app-card app-card--dark">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Routine</th>
                  <th>Duration</th>
                  <th>Intensity</th>
                  <th>Notes</th>
                  <th>Actions</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...logs]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((log) => (
                    <tr key={log.logId}>
                      <td>
                        <em>{log.routineTitle}</em>
                      </td>
                      <td>
                        {log.duration >= 60 &&
                          `${Math.floor(log.duration / 60)}h `}
                        {log.duration % 60}m
                      </td>
                      <td>{log.intensity}</td>
                      <td>{log.notes}</td>
                      <td>
                        <Link
                          className="btn btn-outline-warning btn-sm me-2"
                          to={`/log/edit/${log.logId}`}
                          state={{ log }}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(log.logId)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>{formatDate(log.date)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h ? `${h}h ` : ""}${m}m`;
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default Profile;
