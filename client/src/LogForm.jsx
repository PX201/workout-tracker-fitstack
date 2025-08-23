import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

const DEFAULT_LOG = { routineId: 0, duration: "", intensity: "", notes: "" };

function LogForm() {
  const [log, setLog] = useState(DEFAULT_LOG);
  const [routines, setRoutines] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = {
      method: "GET",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };
    fetch(`${BASE_API_URL}/user/me/routine`, init)
      .then((r) =>
        r.status === 200 || r.status === 403
          ? r.json()
          : Promise.reject(r.status)
      )
      .then((data) => {
        setRoutines(data || []);
        if ((data || []).length > 0) {
          setLog((prev) => ({ ...prev, routineId: data[0].routineId }));
        }
      })
      .catch(console.log);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target; // values come in as strings
    setLog((prev) => ({ ...prev, [id]: value }));
  };

  // Optional quick-preset helpers (used by the small buttons)
  const setPresetMinutes = (m) =>
    setLog((p) => ({ ...p, duration: String(m) }));
  const setPresetIntensity = (v) =>
    setLog((p) => ({ ...p, intensity: String(v) }));

  // Basic client validation
  const validate = () => {
    const msgs = [];
    if (!log.routineId || Number(log.routineId) === 0)
      msgs.push("Please choose a routine.");
    const duration = Number(log.duration || 0);
    if (!duration || duration <= 0)
      msgs.push("Duration must be a positive number.");
    const intensity = Number(log.intensity || 0);
    if (!intensity || intensity < 1 || intensity > 10)
      msgs.push("Intensity must be between 1 and 10.");
    return msgs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const msgs = validate();
    if (msgs.length) {
      setErrors(msgs);
      return;
    }

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify({
        ...log,
        routineId: Number(log.routineId),
        duration: Number(log.duration),
        intensity: Number(log.intensity),
      }),
    };
    fetch(`${BASE_API_URL}/user/log`, init)
      .then((r) =>
        r.status === 201 || r.status === 400
          ? r.json()
          : [401, 403, 404].includes(r.status)
          ? r.text()
          : Promise.reject(r.status)
      )
      .then((data) => {
        if (data?.logId) navigate("/profile");
        else if (typeof data === "string") setErrors([data]);
        else setErrors(data || []);
      })
      .catch(console.log);
  };

  return (
    <section className="container-md py-4">
      <h2 className="app-title text-center mb-4">Log a Workout!</h2>

      {errors.length > 0 && (
        <div className="alert alert-danger lf-alert" role="alert">
          <ul className="mb-0">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="app-card app-card--dark">
            <form onSubmit={handleSubmit} className="lf-form">
              {/* Routine */}
              <div className="mb-3">
                <label htmlFor="routineId" className="form-label">
                  Routine
                </label>
                <select
                  id="routineId"
                  className="form-select"
                  value={log.routineId}
                  onChange={handleChange}
                >
                  {routines.map((r) => (
                    <option key={r.routineId} value={r.routineId}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration — slider */}
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">
                  Duration (minutes)
                </label>

                <div className="lf-range-wrap">
                  <input
                    id="duration"
                    type="range"
                    className="lf-range"
                    min="10"
                    max="120"
                    step="5"
                    value={String(log.duration || 45)}
                    onChange={handleChange}
                  />
                  <span className="lf-range-value">{log.duration || 45}m</span>
                </div>

                <div className="lf-presets">
                  {[20, 30, 45, 60, 90].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPresetMinutes(m)}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity — slider */}
              <div className="mb-3">
                <label htmlFor="intensity" className="form-label">
                  Intensity (1–10)
                </label>

                <div className="lf-range-wrap">
                  <input
                    id="intensity"
                    type="range"
                    className="lf-range"
                    min="1"
                    max="10"
                    step="1"
                    value={String(log.intensity || 5)}
                    onChange={handleChange}
                  />
                  <span className="lf-range-value">{log.intensity || 5}</span>
                </div>

                <div className="lf-presets">
                  {[4, 6, 8, 10].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPresetIntensity(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="form-control"
                  placeholder="Optional notes, PRs, how it felt…"
                  value={log.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Actions */}
              <div className="app-actions mt-2">
                <button type="submit" className="btn btn-success">
                  Add Log
                </button>
                <Link to="/profile" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogForm;
