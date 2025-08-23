import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

function Registration() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const url = `${BASE_API_URL}/auth/register`;
  const navigate = useNavigate();

  // update user with form input
  const handleChange = (event) => {
    const newUser = { ...user };
    newUser[event.target.id] = event.target.value;
    setUser(newUser);
  }

  // register user on form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (user.password !== user.repeatPassword) {
      setErrors({messages: ["Passwords do not match"], timestamp: Date.now()});
      return;
    }
    delete user.repeatPassword;

    // HTTP request
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    };
    fetch(url, init)
      .then(response => {
        if (response.status === 201 || response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (data.userId) {
          navigate(`/login/${data.username}`);
        } else if (data.messages) {
          user.repeatPassword = user.password;
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
  <>
    <section className="container-sm mt-5">
      <div className="text-center mb-4">
        <h1 className="mb-4">Fitstack Workout Tracker</h1>
        <h2 className="app-title">Register</h2>
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
        <form
          onSubmit={handleSubmit}
          className="col-12 col-md-6 col-lg-4 app-card app-card--dark"
        >
          <fieldset className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              id="username"
              onChange={handleChange}
            />
          </fieldset>

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

          <fieldset className="mb-4">
            <label htmlFor="repeatPassword">Repeat password</label>
            <input
              type="password"
              className="form-control"
              name="repeatPassword"
              id="repeatPassword"
              onChange={handleChange}
            />
          </fieldset>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Register
            </button>
            <Link to="/" className="btn btn-link">
              Returning User?
            </Link>
          </div>
        </form>
      </div>
    </section>
  </>
);
}

export default Registration;