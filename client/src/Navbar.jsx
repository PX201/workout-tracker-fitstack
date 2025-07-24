import { useEffect } from "react";
import { Link } from "react-router-dom";

const SESSION_TIME = 1000 * 60 * 60;


const Navbar = () => {

    const userRole = sessionStorage.getItem("user_role");
    return(
        <>
            {!userRole && <DefaultNavbar/>}
            {userRole === "USER" && <UserNavbar/>}
            {userRole === "ADMIN" && <AdminNavbar/>}
        </>
    )

}


const DefaultNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#defaultNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="defaultNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const AdminNavbar = () => {
  const username = sessionStorage.getItem("user_username");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      sessionStorage.clear();
      window.location.href = "/";
    }, SESSION_TIME);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <span className="nav-link">Welcome, <strong>{username}</strong></span>
            </li>
            <li className="nav-item"><Link className="nav-link" to="/admin/users">User List</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/routines">Routine List</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/body">Body</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/log/add">Add Log</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/routine/add">Add Routine</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/edit">Edit User</Link></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const UserNavbar = () => {
  const username = sessionStorage.getItem("user_username");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      sessionStorage.clear();
      window.location.href = "/";
    }, SESSION_TIME);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#userNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <span className="nav-link">Welcome, <strong>{username}</strong></span>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/body">Body</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/log/add">Add Log</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/routine/add">Add Routine</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/edit">Edit User</Link></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;