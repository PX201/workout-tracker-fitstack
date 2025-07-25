import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEFAULT_LOG = {
  routineId: 0,
  duration: 0,
  intensity: 0,
  notes: ""
}

function LogForm() {
  const [log, setLog] = useState(DEFAULT_LOG);
  const [routines, setRoutines] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/user"

  useEffect(() => {
    // HTTP request to get routines
    const init = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    }
    fetch(`${url}/me/routine`, init)
      .then(response => {
        if (response.status === 200 || response.status === 403) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        setRoutines(data);
        const newLog = { ...log };
        if (data.length > 0) {
          newLog.routineId = data[0].routineId; // set initial routine for log
        }
        setLog(newLog);
      }).catch(console.log);    
  }, []);

  // update log on form change
  const handleChange = (event) => {
    const newLog = { ...log };
    newLog[event.target.id] = event.target.value;
    setLog(newLog);
  }

  const handleSubmit = (event) => {
    // TODO: add log with HTTP request
    event.preventDefault();

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      },
      body: JSON.stringify(log)
    };
    fetch(`${url}/log`, init)
    .then(response => {
      if (response.status === 201 || response.status === 400) {
        return response.json();
      } else if (response.status === 401 || response.status === 403 || response.status === 404){
        return response.text();
      } else {
        return Promise.reject(`Unexpected Status Code: ${response.status}`);
      }
    }).then(data => {
      if (data.logId) {
        navigate("/profile");
      } else if (typeof data === "string"){
        setErrors([data]);
      } else {
        setErrors(data);
      }
    }
    );
  };

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Log A Workout!</h2>
        </div>

        {errors.length > 0 && (
          <div className="row d-flex justify-content-center">
            <div className="alert alert-danger mt-4 mb-4 col-4">
              <ul>
                {errors.map(e => <li key={e}>{e}</li> )}
              </ul>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="routineId">Routine</label>
              <select className="form-control" id="routineId" onChange={handleChange}>
                {routines.map(r => {
                  return (
                    <option key={r.routineId} value={r.routineId}>
                      {r.title}
                    </option>);
                })}
              </select>
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="duration">Duration (minutes)</label>
              <input type="number" className="form-control" id="duration" onChange={handleChange} />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="intensity">Intensity (1-10)</label>
              <input type="number" className="form-control" id="intensity" onChange={handleChange} />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="notes">Notes</label>
              <textarea type="text" className="form-control" rows="3" id="notes" onChange={handleChange}/>
            </fieldset>
            <button
              type="submit"
              className="btn btn-outline-success me-2"
            >
              Add Log
            </button>
            <Link
              type="button"
              className="btn btn-outline-danger"
              to={"/profile"}
            >
              Cancel
            </Link>
          </form>
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export default LogForm;