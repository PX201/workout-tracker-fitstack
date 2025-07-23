import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

function EditLog() {
  const location = useLocation();
  const passedLog = location.state?.log;

  const [log, setLog] = useState({
    logId: passedLog?.logId || 0,
    routineId: passedLog?.routineId || "",
    duration: passedLog?.duration || "",
    intensity: passedLog?.intensity || "",
    notes: passedLog?.notes || "",
    date: passedLog?.date || "",
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const nextLog = { ...log };
    nextLog[evt.target.id] = evt.target.value;
    setLog(nextLog);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setErrors([]);
    console.log(log);
    fetch(`http://localhost:8080/api/log/${log.logId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then((err) => Promise.reject(err));
      })
      .then(() => {
        navigate("/profile");
      })
      .catch((err) => {
        if (err && err.length) {
          setErrors(err);
        } else {
          setErrors(["Unknown error occurred."]);
        }
      });
  };

  const routineTitle = passedLog?.routineTitle || "";

  return (
    <>
      <UserNavbar />
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Edit Log</h2>
        </div>

        {errors.length !== 0 && (
          <div className="row d-flex justify-content-center">
            <div className="alert alert-danger mt-4 mb-4 col-4">
              <ul>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label>Routine</label>
              <input
                type="text"
                className="form-control"
                value={routineTitle}
                disabled
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                id="duration"
                value={log.duration}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="intensity">Intensity (1-10)</label>
              <input
                type="number"
                className="form-control"
                id="intensity"
                value={log.intensity}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="notes">Notes</label>
              <textarea
                className="form-control"
                rows="3"
                id="notes"
                value={log.notes}
                onChange={handleChange}
              />
            </fieldset>
            <button type="submit" className="btn btn-outline-success me-2">
              Save Changes
            </button>
            <Link to="/profile" className="btn btn-outline-danger">
              Cancel
            </Link>
          </form>
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export default EditLog;
