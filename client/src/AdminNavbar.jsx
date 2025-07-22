import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const [user, setUser] = useState("<username>");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <h2 className="me-auto ps-4">Welcome {user}</h2>
      <div className="navbar-nav ms-auto p-2 pe-4">
          <Link type="button" className="active nav-link ms-4" to={'/admin/users'}>User List</Link>
          <Link type="button" className="active nav-link ms-4" to={'/admin/routines'}>Routine List</Link>
          <button className="btn btn-danger ms-4 me-4" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;