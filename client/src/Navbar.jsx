import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SESSION_TIME = 1000 * 60 * 60;

// Helper to hide an offcanvas safely (no-op if bootstrap isn't loaded)
function hideOffcanvasById(id) {
  try {
    const el = document.getElementById(id);
    if (!el) return;
    const bs = window.bootstrap?.Offcanvas.getInstance(el) || (window.bootstrap ? new window.bootstrap.Offcanvas(el) : null);
    bs?.hide();
  } catch (err) {
    // fail silently if bootstrap isn't present
    // console.warn("hideOffcanvasById error:", err);
  }
}

const Navbar = () => {
  const userRole = sessionStorage.getItem("user_role");
  return (
    <>
      {!userRole && <DefaultNavbar />}
      {userRole === "USER" && <UserNavbar />}
      {userRole === "ADMIN" && <AdminNavbar />}
    </>
  );
};

/* ================= Default (logged out) ================= */
const DefaultNavbar = () => {
  const offId = "defaultOffcanvas";
  const navigate = useNavigate();

  const go = (to) => {
    hideOffcanvasById(offId);
    // wait a bit then navigate so the offcanvas hide starts (smooth UX)
    setTimeout(() => navigate(to), 120);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar app-navbar--dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>

          {/* Mobile hamburger -> offcanvas */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${offId}`}
            aria-controls={offId}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop links */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/registration">Register</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS OUTSIDE THE NAV */}
      <div
        className="offcanvas offcanvas-end app-offcanvas app-offcanvas--dark d-lg-none"
        id={offId}
        tabIndex="-1"
        aria-labelledby={`${offId}-label`}
      >
        <div className="offcanvas-header">
          {/* <h5 className="offcanvas-title" id={`${offId}-label`}>Menu</h5> */}
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <button className="nav-link btn btn-link w-100" onClick={() => go("/")}>Login</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link w-100" onClick={() => go("/registration")}>Register</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

/* ================= Admin ================= */
const AdminNavbar = () => {
  const username = sessionStorage.getItem("user_username");
  const offId = "adminOffcanvas";
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      // hide then force redirect to login
      hideOffcanvasById(offId);
      setTimeout(() => (window.location.href = "/"), 120);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      sessionStorage.clear();
      window.location.href = "/";
    }, SESSION_TIME);
    return () => clearTimeout(t);
  }, []);

  const go = (to) => {
    hideOffcanvasById(offId);
    setTimeout(() => navigate(to), 120);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar app-navbar--dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>

          {/* Mobile hamburger -> offcanvas */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${offId}`}
            aria-controls={offId}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop links */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><span className="nav-link disabled opacity-75">Welcome, <strong>{username}</strong></span></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/users">User List</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/routines">Routine List</Link></li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/body">Body</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/log/add">Add Log</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/routine/add">Add Routine</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/edit">Account</Link></li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS OUTSIDE THE NAV */}
      <div
        className="offcanvas offcanvas-end app-offcanvas app-offcanvas--dark d-lg-none"
        id={offId}
        tabIndex="-1"
        aria-labelledby={`${offId}-label`}
      >
        <div className="offcanvas-header">
          {/* <h5 className="offcanvas-title" id={`${offId}-label`}>Menu</h5> */}
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body text-center">
          <div className="mb-2 small opacity-75">Welcome, <strong>{username}</strong></div>

          <ul className="navbar-nav mb-3">
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/admin/users")}>User List</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/admin/routines")}>Routine List</button></li>
          </ul>

          <hr />

          <ul className="navbar-nav">
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/profile")}>Profile</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/calendar")}>Calendar</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/body")}>Body</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/log/add")}>Add Log</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/routine/add")}>Add Routine</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/edit")}>Account</button></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-danger w-100" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

/* ================= User ================= */
const UserNavbar = () => {
  const username = sessionStorage.getItem("user_username");
  const offId = "userOffcanvas";
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      hideOffcanvasById(offId);
      setTimeout(() => (window.location.href = "/"), 120);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      sessionStorage.clear();
      window.location.href = "/";
    }, SESSION_TIME);
    return () => clearTimeout(t);
  }, []);

  const go = (to) => {
    hideOffcanvasById(offId);
    setTimeout(() => navigate(to), 120);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar app-navbar--dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">Workout Tracker</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target={`#${offId}`}
            aria-controls={offId}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><span className="nav-link disabled opacity-75">Welcome, <strong>{username}</strong></span></li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/calendar">Calendar</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/body">Body</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/log/add">Add Log</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/routine/add">Add Routine</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/edit">Account</Link></li>
              <li className="nav-item">
                <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS OUTSIDE THE NAV */}
      <div
        className="offcanvas offcanvas-end app-offcanvas app-offcanvas--dark d-lg-none"
        id={offId}
        tabIndex="-1"
        aria-labelledby={`${offId}-label`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id={`${offId}-label`}>Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body text-center">
          <div className="mb-2 small opacity-75">Welcome, <strong>{username}</strong></div>
          <ul className="navbar-nav">
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/profile")}>Profile</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/calendar")}>Calendar</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/body")}>Body</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/log/add")}>Add Log</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/routine/add")}>Add Routine</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link w-100" onClick={() => go("/edit")}>Account</button></li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-danger w-100" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
