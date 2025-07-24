import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const ADMIN_BASE_URL = `http://localhost:8080/api/admin`;
const ROUTINE_URL = `http://localhost:8080/api/user/routine`;

function AdminRoutineList() {
  const [routines, setRoutines] = useState([]);
  const adminRoutinesUrl = `${ADMIN_BASE_URL}/routine`

  

  useEffect(() => {
    const init = { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    };
    fetch(adminRoutinesUrl, init)
    .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      })
      .then((data) => {
        setRoutines(data);
      })
      .catch(console.log);
  }, []);


const handleDelete = (routineId) => {
  const routine = routines.find((r) => r.routineId === routineId);

    // show confirmation popup first
    if (window.confirm(`Delete routine ${routine.title}?`)) {
      const init = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("me")}`,
        },
      };
      fetch(`${ROUTINE_URL}/${routineId}`, init)
        .then((response) => {
          if (response.status === 204) {
            // successful delete
            const newRoutines = routines.filter((r) => r.routineId !== routineId);
            setRoutines(newRoutines);
          } else {
            // failure to delete
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .catch(console.log);
    }

}

const handleEdit = (routineId) => {

}
  return (
    <>
      <AdminNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-12">
          <div className="text-center mb-4">
            <h2>Routine List</h2>
          </div>
          <div>
            <RoutinesList routines={routines} handleEdit={handleEdit} handleDelete={handleDelete}/>
          </div>
        </div>
      </section>
    </>
  );
}

const RoutinesList = ({ routines, handleEdit, handleDelete }) => {
  return (
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
            <td>{r.muscles.slice(0,-1).map(m => { return <span key={m}>&nbsp;{m},</span> })}
                    &nbsp;{r.muscles.slice(-1)}</td>
            <td>
              <button
                className={"btn me-2 btn-outline-warning"}
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
};

export default AdminRoutineList;