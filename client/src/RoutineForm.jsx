import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";


function RoutineForm() {
  const [routines, setRoutines] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/user"
  const muscleUrl = "http://localhost:8080/api/muscles";

  useEffect(() => {
    // HTTP request to get muscles
    const init = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    }
    fetch(muscleUrl, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        if (data) {
          setMuscles(data);
        }
      }).catch(console.log);

    // HTTP request to get routines
    fetch(`${url}/me/routine`, init)
      .then(response => {
        if (response.status === 200 || response.status === 403) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        setRoutines(data);
      }).catch(console.log);
  }, []);

  const handleSubmit = (event) => {
    // TODO: add routine with HTTP request
    event.preventDefault();
    navigate("/profile");
  };

  return (
    <>
      <UserNavbar />
      <section className="container-sm mt-5">
        <div className="row justify-content-around">

          <div className="col-4">
            <div className="text-center mb-4">
              <h2>Routine List</h2>
            </div>

            <div>
              {routines.map(r => {
                return (
                  <div key={r.routineId} className="border border-muted rounded mb-2 p-2">
                    <h4>{r.title}</h4>
                    <p>Muscle Groups:
                      {r.muscles.slice(0, -1).map(m => { return <span key={m}>&nbsp;{m.toLowerCase()},</span> })}
                      &nbsp;{r.muscles.length > 0 && (r.muscles.slice(-1)[0].toLowerCase())}
                    </p>
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
          </div>

          <div className="col-4">
            <div className="text-center mb-4">
              <h2>Add Routine</h2>
            </div>
            <form onSubmit={handleSubmit} className="border border-muted rounded p-4">
              <fieldset className="mb-4">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" />
              </fieldset>
              {muscles.map(m => {
                return (
                  <fieldset key={m}>
                    <label htmlFor={m}>{m.toLowerCase().replace("_", " ")}</label>
                    <input type="checkbox" className="form-check-input" value="" id={m} />
                  </fieldset>
                );
              })}
              <button
                type="submit"
                className="btn btn-outline-success me-2"
              >
                Add Routine
              </button>
              <Link
                type="button"
                className="btn btn-outline-danger"
                to={"/profile"}
              >
                Cancel
              </Link>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}

export default RoutineForm;