import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserForm() {
  const navigate = useNavigate();

  // TODO: set default fields for user
  useEffect(() => {

  }, []);

  const handleSubmit = (event) => {
    // TODO: update user with HTTP request
    event.preventDefault();
    navigate("/profile");
  }

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Edit User:</h2>
        </div>
        <div className="row justify-content-center">
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="username">New username</label>
              <input type="text" className="form-control" id="username" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="email">New email address</label>
              <input type="email" className="form-control" id="email" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">New password</label>
              <input type="password" className="form-control" id="password" />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">Repeat new password</label>
              <input type="password" className="form-control" id="password" />
            </fieldset>
            <button
              type="submit"
              className="btn btn-dark me-2"
            >
              Submit
            </button>
            <Link
              type="button"
              className="btn btn-dark"
              to={"/profile"}
            >
              Cancel
            </Link>
          </form>
        </div>
      </section>
    </>
  );
}

export default UserForm;