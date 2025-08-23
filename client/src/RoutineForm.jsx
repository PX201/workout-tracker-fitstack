import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

const DEFAULT_ROUTINE = {routineId: 0, userId: 0, title: "", muscles: [] };

function RoutineForm() {
  const [routines, setRoutines] = useState([]);
  const [routine, setRoutine] = useState(DEFAULT_ROUTINE);
  const [editRoutineId, setEditRoutineId] = useState(0);
  const [muscles, setMuscles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const url = `${BASE_API_URL}/user`;
  const muscleUrl = `${BASE_API_URL}/muscles`;

  useEffect(() => {
    const init = {
      method: "GET",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };
    Promise.all([
      fetch(muscleUrl, init).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
      fetch(`${url}/me/routine`, init).then((r) =>
        r.status === 200 || r.status === 403
          ? r.json()
          : Promise.reject(r.status)
      ),
    ])
      .then(([m, rs]) => {
        setMuscles(m || []);
        setRoutines(rs || []);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const pretty = (s) => s.toLowerCase().replaceAll("_", " ");

  const handleDelete = (routineId) => {
    const r = routines.find((x) => x.routineId === routineId);
    if (!r) return;
    if (!window.confirm(`Delete ${r.title}?`)) return;

    const init = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };
    fetch(`${url}/routine/${routineId}`, init)
      .then((res) => (res.status === 204 ? null : Promise.reject(res.status)))
      .then(() => {
        setRoutines((xs) => xs.filter((x) => x.routineId !== routineId));
        setErrors({});
      })
      .catch(console.log);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setRoutine((prev) => {
      if (type === "checkbox") {
        const set = new Set(prev.muscles);
        if (checked) set.add(name);
        else set.delete(name);
        return { ...prev, muscles: Array.from(set) };
      }
      return { ...prev, [name]: value };
    });
  };

  const fillFormEdit = (routineId) => {
    const r = routines.find((x) => x.routineId === routineId);
    if (!r) return;
    setRoutine({routineId: r.routineId, userId: r.userId, title: r.title, muscles: [...r.muscles] });
    setEditRoutineId(routineId);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const messages = [];
    if (!routine.title.trim()) messages.push("Title is required.");
    if (routine.muscles.length === 0)
      messages.push("Pick at least one muscle.");
    return messages;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messages = validate();
    if (messages.length) {
      setErrors({ messages });
      return;
    }
    editRoutineId ? editRoutine() : addRoutine();
  };

  const refreshAndReset = () => {
    const init = {
      method: "GET",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("me")}` },
    };
    fetch(`${url}/me/routine`, init)
      .then((r) => (r.ok || r.status === 403 ? r.json() : []))
      .then((data) => setRoutines(data || []))
      .finally(() => {
        setRoutine(DEFAULT_ROUTINE);
        setEditRoutineId(0);
        setErrors({});
      });
  };

  const addRoutine = () => {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(routine),
    };
    fetch(`${url}/me/routine`, init)
      .then((r) =>
        [201, 400, 401].includes(r.status) ? r.json() : Promise.reject(r.status)
      )
      .then((data) => {
        if (data?.title) refreshAndReset();
        else if (data?.messages) setErrors(data);
      })
      .catch(console.log);
  };

  const editRoutine = () => {
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(routine),
    };
    fetch(`${url}/me/routine/${editRoutineId}`, init)
      .then((r) =>
        r.status === 204
          ? null
          : [401, 403, 404].includes(r.status)
          ? r.json()
          : Promise.reject(r.status)
      )
      .then((data) => {
        if (!data) refreshAndReset();
        else if (data?.messages) setErrors(data);
      })
      .catch(console.log);
  };

  const cancelAddOrEdit = () => {
    if (editRoutineId > 0) {
      setRoutine(DEFAULT_ROUTINE);
      setEditRoutineId(0);
      setErrors({});
    } else {
      navigate("/profile");
    }
  };

  const sortedMuscles = useMemo(
    () => [...muscles].sort((a, b) => pretty(a).localeCompare(pretty(b))),
    [muscles]
  );

  return (
    <section className="container py-4">
      <div className="row g-4 justify-content-center">
       
        {/* Left: Add/Edit form */}
        <div className="col-12 col-lg-5">
          <h2 className="app-title text-center mb-3">
            {editRoutineId > 0 ? "Edit Routine" : "Add Routine"}
          </h2>
          <div className="app-card app-card--dark">
            {errors.messages?.length ? (
              <div className="alert alert-danger app-alert" role="alert">
                <ul className="mb-0">
                  {errors.messages.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="app-form">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Push day"
                  value={routine.title}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Muscle groups</label>
                <div className="rf-muscles">
                  {sortedMuscles.map((m) => (
                    <label key={m} className="rf-muscle">
                      <input
                        type="checkbox"
                        name={m}
                        checked={routine.muscles.includes(m)}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <span>{pretty(m)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="app-actions mt-2">
                <button type="submit" className="btn btn-success">
                  {editRoutineId > 0 ? "Update Routine" : "Add Routine"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelAddOrEdit}
                >
                  {editRoutineId > 0 ? "Cancel Edit" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>

         {/* Right: Routine list */}
        <div className="col-12 col-lg-5">
          <h2 className="app-title text-center mb-3">Routine List</h2>
          <div className="app-card app-card--dark">

            {loading && <div className="text-center py-3">Loading…</div>}

            {!loading && routines.length === 0 && (
              <p className="mb-0">No routines yet. Create your first one ➜</p>
            )}

            <div className="mt-2">
              {routines.map((r) => (
                <div key={r.routineId} className="app-item mb-2">
                  <h5 className="mb-1">{r.title}</h5>
                  <p className="mb-2">{r.muscles.map(pretty).join(", ")}</p>
                  <div className="app-actions">
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => fillFormEdit(r.routineId)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(r.routineId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default RoutineForm;
