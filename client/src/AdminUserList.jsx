import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const adminUrl = "http://localhost:8080/api/admin/users";

  useEffect(() => {
    // set user list with HTTP request
    const init = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    }
    fetch(adminUrl, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        setUsers(data);
      }).catch(console.log);
  }, []);

  // switch user active status
  const toggleActive = (userId) => {
    const user = users.find(u => u.userId === userId);

    // show confirmation popup first
    if (window.confirm(`${user.active ? "Deactivate " : "Activate "} user ${user.username}?`)) {
      
      const init = {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("me")}`
        }
      }
      fetch(`${adminUrl}/${userId}/${user.active ? "false" : "true"}`, init)
        .then(response => {
          if (response.status === 200) { // success, but update HTTP response has no content
            return null;
          } else if (response.status === 400) {
            return response.json();
          } else {
            return Promise.reject(`Unexpected Status Error: ${response.status}`);
          }
        }).then(data => {
          if (!data) {
            // set new active status on frontend
            const newUsers = [...users];
            user.active = !user.active;
            newUsers.forEach(u => { if (u.userId === userId) u = user; });
            setUsers(newUsers);
          } else {
            setErrors(data);
          }
        }).catch(console.log);
    }
  }

  // delete user
  const handleDelete = (userId) => {
    const user = users.find(u => u.userId === userId);

    // show confirmation popup first
    if (window.confirm(`Delete user ${user.username}?`)) {

      const init = {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("me")}`
        }
      };
      fetch(`${adminUrl}/${userId}`, init)
        .then(response => {
          if (response.status === 204) { // successful delete
            const newUsers = users.filter(u => u.userId !== userId);
            setUsers(newUsers);
          } else { // failure to delete
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        }).catch(console.log);
    }
  }

  return (
    <>
      <AdminNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-8">
          <div className="text-center mb-4">
            <h2>User List</h2>
          </div>
          {errors.messages && errors.messages.length !== 0 && (
            <div className="row d-flex justify-content-center">
              <div className="alert alert-danger mt-4 mb-4 col-4">
                <ul>
                  {errors.messages.map(e => <li key={e}>{e}</li>)}
                </ul>
              </div>
            </div>
          )}
          <div>
            {users.map(u => {
              return (
                <div key={u.userId} className="border border-muted rounded mb-2 p-3">
                  <h4 className="mb-4">Username: {u.username}</h4>
                  <p>email: {u.email}</p>
                  <p>date joined: {u.dateJoined}</p>
                  <p>active: {u.active ? "yes" : "no"} </p>
                  {u.active ? (
                    <button className="btn btn-outline-danger me-2" onClick={() => {toggleActive(u.userId)}}>
                      Deactivate
                    </button>
                  ) : (
                    <button className="btn btn-outline-success me-2" onClick={() => {toggleActive(u.userId)}}>
                      Activate
                    </button>
                  )}
                  <button className="btn btn-outline-danger" onClick={() => {handleDelete(u.userId)}}>
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

export default AdminUserList;