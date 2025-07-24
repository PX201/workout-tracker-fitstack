import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { DEFAULT_USER, userUrl } from "./components/UserInfo.js" 

function Profile() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [logs, setLogs] = useState([]);
  const url = "http://localhost:8080/api/user";
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // fetch user info
    const init = { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    };
    fetch(`${url}/log/me`, init)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }else {
          return Promise.reject(`Error fetching logs: ${response.status}`);
        }
    }).then(data => {
      setLogs(data);
    }).catch(err => {
        console.error(err);
        setErrors(["Could not fetch logs."]);
      });
  }, []);

function handleDelete(logId) {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    const init = {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    };

    fetch(`${url}/log/${logId}`, init)
      .then(response => {
        if (response.ok) {
          setLogs(prev => prev.filter(l => l.logId !== logId));
        } else {
          return Promise.reject("Failed to delete log.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrors(["Could not delete log."]);
      });
  }

  return (
    <>
     
      <section className="container mt-5">
        <h2 className="text-center mb-4">Your Logs</h2>

        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul>{errors.map((e, idx) => <li key={idx}>{e}</li>)}</ul>
          </div>
        )}

        {logs.length === 0 ? (
          <p>No logs found. <Link to="/log/add">Add your first log</Link></p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Routine</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Intensity</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.logId}>
                  <td>{log.routineTitle}</td>
                  <td>{log.date}</td>
                  <td>{log.duration} min</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default Profile;