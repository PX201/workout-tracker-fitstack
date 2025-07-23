import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { useFormContext } from "react-hook-form";

const DEFAULT_ROUTINE = {
  title: "",
  muscles: []
}

function RoutineForm() {
  const [routines, setRoutines] = useState([]);
  const [routine, setRoutine] = useState(DEFAULT_ROUTINE);
  const [muscles, setMuscles] = useState([]);
  const [errors, setErrors] = useState({});
  const url = "http://localhost:8080/api/user"
  const muscleUrl = "http://localhost:8080/api/muscles";
  let editRoutineId = 0;

  // initial page load
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

    // get routines
    fetchRoutines();
  }, []);

  // HTTP Request to fetch routines
  const fetchRoutines = () => {
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
      }).catch(console.log);
  }

  // delete routine
  const handleDelete = (routineId) => {
    const routineToDelete = routines.find(r => r.routineId === routineId);

    // show confirmation popup first
    if (window.confirm(`Delete ${routineToDelete.title}?`)) {

      const init = {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("me")}`
        }
      };
      fetch(`${url}/routine/${routineId}`, init)
        .then(response => {
          if (response.status === 204) { // successful delete
            const newRoutines = routines.filter(r => r.routineId !== routineId);
            setRoutines(newRoutines);
            setErrors([]);
          } else { // failure to delete
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        }).catch(console.log);
    }
  }

  // update form on form change
  const handleChange = (event) => {
    const newRoutine = { ...routine };

    // special handling for checkboxes, add/remove muscles from array
    if (event.target.type === "checkbox") {
      if (event.target.checked) {
        newRoutine.muscles.push(event.target.name);
      } else {
        newRoutine.muscles = newRoutine.muscles.filter(m => m !== event.target.name);
      }

    } else {
      newRoutine[event.target.name] = event.target.value;
    }
    setRoutine(newRoutine);
  }

  // fill form when editing
  const fillFormEdit = (routineId) => {
    const editRoutine = routines.find(r => r.routineId === routineId);
    setRoutine(editRoutine);
  }

  // add routine on form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    // HTTP request to add routine
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      },
      body: JSON.stringify(routine)
    };
    fetch(`${url}/me/routine`, init)
      .then(response => {
        if (response.status === 201 || response.status === 400 || response.status === 401) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        if (data.title) {
          fetchRoutines(); // fetch updated routine list
          setErrors([]); // reset errors on success
        } else {
          setErrors(data);
        }
      });
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
                      {r.muscles.slice(0, -1).map(m => { return <span key={m}>&nbsp;{m.toLowerCase().replace("_", " ")},</span> })}
                      &nbsp;{r.muscles.length > 0 && (r.muscles[r.muscles.length - 1].toLowerCase().replace("_", " "))}
                    </p>
                    <button className="btn btn-outline-warning me-2" onClick={() => {fillFormEdit(r.routineId)}}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => { handleDelete(r.routineId) }}>
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
            {errors.messages && errors.messages.length !== 0 && (
              <div className="row d-flex justify-content-center">
                <div className="alert alert-danger mt-4 mb-4">
                  <ul>
                    {errors.messages.map(e => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="border border-muted rounded p-4">
              <fieldset className="mb-4">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" name="title" value={routine.title} onChange={handleChange} />
              </fieldset>
              {muscles.map(m => {
                return (
                  <fieldset key={m}>
                    <label htmlFor={m}>{m.toLowerCase().replace("_", " ")}</label>
                    <input type="checkbox" className="form-check-input" checked={routine.muscles.includes(m)} id={m} name={m} onChange={handleChange} />
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