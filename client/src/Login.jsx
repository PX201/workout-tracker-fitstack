import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({});
  const { username } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/auth/login";

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
    fetch(url, init)
      .then(response => {
        if (response.status === 200 || response.status === 400 || response.status === 404) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.token) {
          // on successful login, put token in session storage
          sessionStorage.setItem("me", data.token);
          if (data.user.role === 'USER') {
            navigate("/profile");
          } else {
            navigate("/admin/users")
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
              <div className="alert alert-success mt-4 mb-4 col-4">
                {username} registered successfully!
              </div>
            </div>
          )}
          <h2>Login:</h2>
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
        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
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
              <button
                className="btn btn-dark"
              >
                Login
              </button>
              <Link
                type="button"
                className="btn btn-link d-flex"
                to={"/registration"}
              >
                New User?
              </Link>
            </div>
          </form>
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export default Login;