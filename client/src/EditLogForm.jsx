import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

function EditLog() {
  const { state } = useLocation();
  const passedLog = state?.log;

  const [log, setLog] = useState({
    logId: passedLog?.logId || 0,
    routineId: passedLog?.routineId || "",
    duration: passedLog?.duration ?? 45,
    intensity: passedLog?.intensity ?? 5,
    notes: passedLog?.notes || "",
    date: passedLog?.date || "",
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const routineTitle = passedLog?.routineTitle || "";

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLog((prev) => ({ ...prev, [id]: value }));
  };

  const setPresetMinutes = (m) => setLog((p) => ({ ...p, duration: String(m) }));
  const setPresetIntensity = (v) => setLog((p) => ({ ...p, intensity: String(v) }));

  const validate = () => {
    const msgs = [];
    const d = Number(log.duration);
    const i = Number(log.intensity);
    if (!d || d <= 0) msgs.push("Duration must be a positive number.");
    if (!i || i < 1 || i > 10) msgs.push("Intensity must be between 1 and 10.");
    return msgs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const msgs = validate();
    if (msgs.length) {
      setErrors(msgs);
      return;
    }

    const payload = {
      ...log,
      duration: Number(log.duration),
      intensity: Number(log.intensity),
    };

    fetch(`${BASE_API_URL}/user/log/${log.logId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) =>
        res.ok ? null : res.json().then((err) => Promise.reject(err))
      )
      .then(() => navigate("/profile"))
      .catch((err) => {
        // server may return an object {messages:[...]} or a raw array
        if (Array.isArray(err)) setErrors(err.length ? err : ["Unknown error occurred."]);
        else if (err?.messages) setErrors(err.messages);
        else setErrors(["Unknown error occurred."]);
      });
  };

  return (
    <section className="container-md py-4">
      <h2 className="app-title text-center mb-4">Edit Log</h2>

      {errors.length > 0 && (
        <div className="alert alert-danger app-alert" role="alert">
          <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="app-card app-card--dark">
            <form onSubmit={handleSubmit} className="app-form">

              {/* Routine (read-only) */}
              <div className="mb-3">
                <label className="form-label">Routine</label>
                <input
                  type="text"
                  className="form-control"
                  value={routineTitle}
                  disabled
                />
              </div>

              {/* Duration — slider (10–120) */}
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration (minutes)</label>
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
                    aria-label="Duration from 10 to 120 minutes"
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

              {/* Intensity — slider (1–10) */}
              <div className="mb-3">
                <label htmlFor="intensity" className="form-label">Intensity (1–10)</label>
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
                    aria-label="Intensity from 1 to 10"
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
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  className="form-control"
                  value={log.notes}
                  onChange={handleChange}
                  placeholder="Optional notes, PRs, how it felt…"
                />
              </div>

              {/* Actions */}
              <div className="app-actions mt-2">
                <button type="submit" className="btn btn-success">Save Changes</button>
                <Link to="/profile" className="btn btn-outline-secondary">Cancel</Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditLog;
