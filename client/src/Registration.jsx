import { Link } from "react-router-dom";

function Registration() {

  const handleSubmit = () => {
    // TODO: handle registration, add new user
  }

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h1 className="mb-4">Fitstack Workout Tracker</h1>
          <h2>Register:</h2>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Repeat password</label>
              <input type="password" className="form-control" id="password" />
            </fieldset>
            <div className="d-flex justify-content-between">
              <Link
                type="button"
                className="btn btn-dark"
                to={"/"}
              >
                Register
              </Link>
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