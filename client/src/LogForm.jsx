import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function LogForm() {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    // TODO: replace with HTTP request to get routines
    setRoutines([
      { routine_id: 1, title: "routine 1" },
      { routine_id: 2, title: "routine 2" },
      { routine_id: 3, title: "routine 3" },
    ]);
  }, []);

  const handleSubmit = () => {
    // TODO: add log with HTTP request
  };

  return (
    <>
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
                    <option key={r.routine_id}>
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
            <Link
              type="button"
              className="btn btn-outline-success me-2"
              to={"/profile"}
            >
              Add Log
            </Link>
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