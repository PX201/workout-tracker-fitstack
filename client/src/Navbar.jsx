import { useEffect } from "react";
import { Link } from "react-router-dom";

const SESSION_TIME = 60000;

{/* TODO: if user not loged in display navbar with register and login */}
{/* TODO: if user loged in as USER display user navbar */}
{/* TODO: if user loged in as ADMIN display admin navbar (will have Admin and user related links)*/}
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
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="navbar-nav ms-auto p-2 pe-4">
              <Link type="button" className="active nav-link ms-4" to={'/login'}>Login</Link>
              <Link type="button" className="active nav-link ms-4" to={'/register'}>Register</Link>
          </div>
        </nav>
      );
}


const UserNavbar = () => {    
    const username = sessionStorage.getItem("user_username");
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            // remove user token
            sessionStorage.clear();
            // force reload and go back to home
            window.location.href = "/";
        }
    }

    useEffect(() => {
        setTimeout(() => { 
            sessionStorage.clear();
            window.location.href = "/";
           }, SESSION_TIME);
    }, []);

    return (
    <nav className="navbar navbar-expand-lg bg-light">
        <h2 className="me-auto ps-4">Welcome {username}</h2>
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

const AdminNavbar = () => {
    const username = sessionStorage.getItem("user_username");
    
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            // clear the session keys and reload the page
            sessionStorage.clear();
            window.location.reload();
            //navigate("/");
            window.location.href = "/";
        }
    }

    useEffect(() => {
        setTimeout(() => { 
            sessionStorage.clear();
            window.location.href = "/";
           }, SESSION_TIME);
    }, []);

    return (
    <nav className="navbar navbar-expand-lg bg-light">
        <h2 className="me-auto ps-4">Welcome {username}</h2>
        <div className="navbar-nav ms-auto p-2 pe-4">
            <Link type="button" className="active nav-link ms-4" to={'/admin/users'}>User List</Link>
            <Link type="button" className="active nav-link ms-4" to={'/admin/routines'}>Routine List</Link>
        </div>

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

export default Navbar;