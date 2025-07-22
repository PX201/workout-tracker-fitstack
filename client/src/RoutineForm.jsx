import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";


function RoutineForm() {
  const [routines, setRoutines] = useState([]);
  const muscles = ["muscle 1", "muscle 2", "muscle 3", "muscle 4", "muscle 5"];
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: replace with HTTP request to get routines (and muscles)
    setRoutines([
      { routine_id: 1, title: "routine 1", muscles: ["muscle 1", "muscle 2"] },
      { routine_id: 2, title: "routine 2", muscles: ["muscle 2", "muscle 3"] },
      { routine_id: 3, title: "routine 3", muscles: ["muscle 1", "muscle 3"] },
    ]);
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
                  <div key={r.routine_id} className="border border-muted rounded mb-2 p-2">
                    <h4>{r.title}</h4>
                    <p>Muscle Groups:
                      {r.muscles.map(m => { return <>{m}, </> })}
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
                    <label htmlFor={m}>{m}</label>
                    <input type="checkbox" class="form-check-input" value="" id={m} />
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