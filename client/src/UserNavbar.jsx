import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserNavbar() {
  const [user, setUser] = useState("<username>");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem("me");
      navigate("/");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <h2 className="me-auto ps-4">Welcome {user}</h2>
      <div className="navbar-nav ms-auto p-2 pe-4">
          <Link type="button" className="active nav-link ms-4" to={'/profile'}>Profile</Link>
          <Link type="button" className="active nav-link ms-4" to={'/calendar'}>Calendar</Link>
          <Link type="button" className="active nav-link ms-4" to={'/body'}>Body</Link>
          <Link type="button" className="btn btn-dark ms-4" to={'/log/add'}>Add Log</Link>
          <Link type="button" className="btn btn-dark ms-4" to={'/routine/add'}>Add Routine</Link>
          <Link type="button" className="btn btn-dark ms-4" to={'/edit'}>Edit User</Link>
          <button className="btn btn-danger ms-4 me-4" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default UserNavbar;