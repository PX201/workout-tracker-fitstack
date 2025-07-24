import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TOKEN = sessionStorage.getItem("me");
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
};
const ADMIN_ROUTINE_URL = "http://localhost:8080/api/admin/routine";
const ROUTINE_URL = "http://localhost:8080/api/user/routine";
const MUSCLE_URL = "http://localhost:8080/api/muscles";


function AdminRoutineList() {
  const [routines, setRoutines] = useState([]);
  const { routineId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = {
      method: "GET",
      headers: HEADERS,
    };
    fetch(ADMIN_ROUTINE_URL, init)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then(setRoutines)
      .catch(console.log);
  }, []);

  const handleDelete = (routineId) => {
    const routine = routines.find((r) => r.routineId === routineId);

    if (window.confirm(`Delete routine ${routine.title}?`)) {
      const init = {
        method: "DELETE",
        headers: HEADERS,
      };
      fetch(`${ROUTINE_URL}/${routineId}`, init)
        .then((response) => {
          if (response.status === 204) {
            const newRoutines = routines.filter((r) => r.routineId !== routineId);
            setRoutines(newRoutines);
          } else {
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .catch(console.log);
    }
  };

  const handleEdit = (routineId) => {
    navigate(`/admin/routines/${routineId}`);
  };

  // If in edit mode, render the form instead of the list
  if (routineId) {
    return (
      <>
        <section className="container mt-5">
          <EditRoutineForm
            routineId={parseInt(routineId)}
            routines={routines}
            setRoutines={setRoutines}
            onCancel={() => navigate("/admin/routines")}
          />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="container d-flex justify-content-center">
        <div className="col-12">
          <div className="text-center mb-4">
            <h2>Routine List</h2>
          </div>
          <RoutinesList
            routines={routines}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </section>
    </>
  );
}

const RoutinesList = ({ routines, handleEdit, handleDelete }) => (
  <table className="table table-striped table-hover">
    <thead className="table-dark">
      <tr>
        <th>Title</th>
        <th>Muscle Groups</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {routines.map((r) => (
        <tr key={r.routineId}>
          <td>{r.title}</td>
          <td>
            {r.muscles.slice(0, -1).map((m) => (
              <span key={m}>&nbsp;{m},</span>
            ))}
            &nbsp;{r.muscles.slice(-1)}
          </td>
          <td>
            <button
              className="btn me-2 btn-outline-warning"
              onClick={() => handleEdit(r.routineId)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleDelete(r.routineId)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const EditRoutineForm = ({ routineId, routines, setRoutines, onCancel }) => {
  const [routine, setRoutine] = useState(null);
  const [muscles, setMuscles] = useState([]);
  const [errors, setErrors] = useState({});
  const routineUrl = `http://localhost:8080/api/user/me/routine/${routineId}`;

  useEffect(() => {
    const init = {
      headers: HEADERS,
    };

    fetch(MUSCLE_URL, init)
      .then(response => response.json())
      .then(setMuscles)
      .catch(console.log);

    const matched = routines.find((r) => r.routineId === routineId);
    setRoutine(matched || null);
  }, [routineId, routines]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...routine, muscles: [...routine.muscles] };

    if (type === "checkbox") {
      updated.muscles = checked
        ? [...updated.muscles, name]
        : updated.muscles.filter((m) => m !== name);
    } else {
      updated[name] = value;
    }

    setRoutine(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...HEADERS,
      },
      body: JSON.stringify(routine),
    };

    fetch(routineUrl, init)
      .then((response) => {
        if (response.status === 204) {
          // Update local state with the modified routine
          const updated = routines.map((r) =>
            r.routineId === routineId ? routine : r
          );
          setRoutines(updated);
          setErrors({});
          onCancel();
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) setErrors(data);
      })
      .catch(console.log);
  };

  if (!routine) return <p>Loading...</p>;

  return (
    <div className="col-md-6 offset-md-3">
      <h2 className="text-center mb-4">Edit Routine</h2>
      {errors?.messages?.length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {errors.messages.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit} className="border p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={routine.title}
            onChange={handleChange}
          />
        </div>
        {muscles.map((m) => (
          <div className="form-check" key={m}>
            <input
              type="checkbox"
              className="form-check-input"
              id={m}
              name={m}
              checked={routine.muscles.includes(m)}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={m}>
              {m.toLowerCase().replace("_", " ")}
            </label>
          </div>
        ))}
        <button type="submit" className="btn btn-outline-success mt-3 me-2">
          Save
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary mt-3"
          onClick={() => {
            setErrors({});
            onCancel();
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminRoutineList;



