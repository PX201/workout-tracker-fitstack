import { Link, useParams } from "react-router-dom";

function Login() {
  const { username } = useParams();

  const handleSubmit = () => {
    // TODO: handle login
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
        <div className="row">
          <div className="col-4"></div>
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" />
            </fieldset>
            <div className="d-flex justify-content-between">
              <Link
                type="button"
                className="btn btn-dark"
                to={"/profile"}
              >
                Login
              </Link>
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