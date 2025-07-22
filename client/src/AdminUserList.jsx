import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // TODO: set users with HTTP request
    setUsers([
      { userId: 1, username: "user1", email: "1@email.com", dateJoined: Date.now(), isActive: true },
      { userId: 2, username: "user2", email: "2@email.com", dateJoined: Date.now(), isActive: false },
    ]);
  }, []);

  return (
    <>
      <AdminNavbar />
      <section className="container d-flex justify-content-center">
        <div className="col-8">
          <div className="text-center mb-4">
            <h2>User List</h2>
          </div>
          <div>
            {users.map(u => {
              return (
                <div key={u.userId} className="border border-muted rounded mb-2 p-2">
                  <h4>{u.username}</h4>
                  <p>email: {u.email}</p>
                  <p>date joined: {u.dateJoined}</p>
                  <p>active: {u.isActive ? "yes" : "no"} </p>
                  {u.isActive ? (
                    <button className="btn btn-outline-danger me-2">
                      Deactivate
                    </button>
                  ) : (
                    <button className="btn btn-outline-success me-2">
                      Activate
                    </button>
                  )}
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

export default AdminUserList;