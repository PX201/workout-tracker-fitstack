import { useState } from "react";
import { Link } from "react-router-dom";

function UserNavbar() {
  const [user, setUser] = useState("<username>");

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <h2 className="me-auto ps-4">Welcome {user}</h2>
      <div className="navbar-nav ms-auto p-2 pe-4">
          <Link type="button" className="active nav-link" to={'/profile'}>Profile</Link>
          <Link type="button" className="btn btn-dark ms-4" to={'/log/add'}>Add Log</Link>
          <Link type="button" className="btn btn-dark ms-4" to={'/routine/add'}>Add Routine</Link>
          <Link type="button" className="btn btn-dark ms-4 me-4" to={'/edit'}>Edit User</Link>
      </div>
    </nav>
  );
}

export default UserNavbar;