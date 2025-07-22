import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

function AdminRoutineList() {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    // TODO: set routines with HTTP request
    setRoutines([
      { routine_id: 1, title: "routine 1", muscles: ["muscle 1", "muscle 2"] },
      { routine_id: 2, title: "routine 2", muscles: ["muscle 2", "muscle 3"] },
      { routine_id: 3, title: "routine 3", muscles: ["muscle 1", "muscle 3"] },
    ]);
  }, []);

  return (
    <>
      <AdminNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-8">
          <div className="text-center mb-4">
            <h2>Routine List</h2>
          </div>
          <div>
            {routines.map(r => {
              return (
                <div key={r.routine_id} className="border border-muted rounded mb-2 p-2">
                  <h4>{r.title}</h4>
                  <p>Muscle Groups:
                    {r.muscles.slice(0,-1).map(m => { return <span key={m}>&nbsp;{m},</span> })}
                    &nbsp;{r.muscles.slice(-1)}
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
      </section>
    </>
  );
}

export default AdminRoutineList;