import { useEffect, useState } from "react";

function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // TODO: set users with HTTP request
    setUsers([
      {}
    ]);
  }, []);

  return (
    <>
      <section className="container">
        <div className="col-4">
          <div className="text-center mb-4">
            <h2>Users</h2>
          </div>
          <div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminUserList;