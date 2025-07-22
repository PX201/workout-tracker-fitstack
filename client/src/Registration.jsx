import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registration() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const url = "http://localhost:8080/api/auth/register";
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
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h1 className="mb-4">Fitstack Workout Tracker</h1>
          <h2>Register:</h2>
        </div>
        {errors.messages && errors.messages.length !== 0 && (
          <div className="row d-flex justify-content-center">
            <div className="alert alert-danger mt-4 mb-4 col-4">
              <ul>
                {errors.messages.map(e => <li key={e}>{e}</li> )}
              </ul>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
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
              <button
                type="submit"
                className="btn btn-dark"
              >
                Register
              </button>
              <Link
                type="button"
                className="btn btn-link d-flex"
                to={"/"}
              >
                Returning User?
              </Link>
            </div>
          </form>
          <div className="col-4"></div>
        </div>
      </section>
    </>
  );
}

export default Registration;