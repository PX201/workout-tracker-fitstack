import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";


function LogForm() {
  const [routines, setRoutines] = useState([]);
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
        console.log(data);
        console.log(sessionStorage.getItem("me"));
        setRoutines(data);
      }).catch(console.log);
  }, []);


  const handleSubmit = (event) => {
    // TODO: add log with HTTP request
    event.preventDefault();
    navigate("/profile");
  };

  return (
    <>
      <UserNavbar />
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Add Log</h2>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="routine">Routine</label>
              <select className="form-control" id="routine">
                {routines.map(r => {
                  return (
                    <option key={r.routineId}>
                      {r.title}
                    </option>);
                })}
              </select>
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="duration">Duration (minutes)</label>
              <input type="number" className="form-control" id="duration" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="intensity">Intensity (1-10)</label>
              <input type="number" className="form-control" id="intensity" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="Notes">Notes</label>
              <textarea type="text" className="form-control" rows="3" id="Notes" />
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