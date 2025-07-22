import { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";

function Profile() {
  const [user, setUser] = useState("<username>");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // TODO: replace with HTTP request
    setLogs([
      { log_id: 1, title: "routine 1", date: "05/01/2025", duration: 60, intensity: 5, notes: "lorem ipsum" },
      { log_id: 2, title: "routine 2", date: "06/01/2025", duration: 30, intensity: 7, notes: "lorem ipsum" },
      { log_id: 3, title: "routine 3", date: "07/01/2025", duration: 120, intensity: 6, notes: "lorem ipsum" },
    ]);
  }, []);

  return (
    <>
      <UserNavbar />
      <section className="container">
        <div className="text-center mt-4 mb-4">
          <h2>{user}'s Profile</h2>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4">
            {logs.map(log => {
              return (
                <div key={log.log_id} className="border border-muted rounded mb-2 p-2">
                  <h4>{log.title}</h4>
                  <p>Duration: {log.duration}</p>
                  <p>Intensity: {log.intensity}</p>
                  <p>Notes: {log.notes}</p>
                  <button className="btn btn-outline-warning me-2">
                    Edit
                  </button>
                  <button className="btn btn-outline-danger">
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export default Profile;