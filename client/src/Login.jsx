import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

function Login() {
  const [user, setUser] = useState({});
  const { username } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // update login credentials with form input
  const handleChange = (event) => {
    const newUser = { ...user };
    newUser[event.target.id] = event.target.value;
    setUser(newUser);
  }

  // login user on form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    };
    fetch(`${BASE_API_URL}/auth/login`, init)
      .then(response => {
        if (response.status === 200 || response.status === 400 || response.status === 404) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.token && data.user) {
          // on successful login, put token and user info in session storage
          sessionStorage.setItem("me", data.token);
          sessionStorage.setItem("user_username", data.user.username);
          sessionStorage.setItem("user_email", data.user.email);
          sessionStorage.setItem("user_role", data.user.role);
          if (data.user.role === 'USER') {
            // force page to reload and get the new session items
            window.location.href = "/profile";
            //navigate("/profile");
          } else {
            window.location.href = "/admin/users";
            //navigate("/admin/users")
          }
          
        } else {
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
  <>
    <section className="container-sm mt-5">
      <div className="text-center mb-4">
        <h1 className="mb-4">Fitstack Workout Tracker</h1>

        {username && (
          <div className="row d-flex justify-content-center">
            <div className="alert alert-success mt-4 mb-4 col-10 col-md-6">
              {username} registered successfully!
            </div>
          </div>
        )}

        <h2 className="app-title">Login</h2>
      </div>

      {errors.messages && errors.messages.length !== 0 && (
        <div className="row d-flex justify-content-center">
          <div className="alert alert-danger mt-4 mb-4 col-10 col-md-6">
            <ul>
              {errors.messages.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <form onSubmit={handleSubmit} className="col-12 col-md-6 col-lg-4 app-card app-card--dark">
          <fieldset className="mb-4">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              onChange={handleChange}
            />
          </fieldset>

          <fieldset className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              onChange={handleChange}
            />
          </fieldset>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Login
            </button>
            <Link to="/registration" className="btn btn-link">
              New User?
            </Link>
          </div>
        </form>
      </div>
    </section>
  </>
);
}

export default Login;