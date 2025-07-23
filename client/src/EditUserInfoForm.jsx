import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = `http://localhost:8080/api`;
const DEFAULT_REQUEST_BODY = {
  email: `${sessionStorage.getItem("user_email")}`,
  username: `${sessionStorage.getItem("user_username")}`,
};

const EditUserInfoForm = () => {
  const editUserInfoUrl = `${BASE_URL}/user/me`;
  const [requestBody, setRequestBody] = useState(DEFAULT_REQUEST_BODY);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  console.log(DEFAULT_REQUEST_BODY);

  const handleChange = (event) => {
    const newRequestBody = { ...requestBody };
    newRequestBody[event.target.id] = event.target.value;
    setRequestBody(newRequestBody);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // HTTP update user info
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(requestBody),
    };
    fetch(editUserInfoUrl, init)
      .then((response) => {
        if (response.status === 200) {
          // successful update returns nothing
          return null;
        } else if (response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      })
      .then((data) => {
        if (!data) {
          // logout and remove all the session key/values
          sessionStorage.clear();
          navigate("/");
        } else if (data.messages) {
          setErrors(data);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Edit User Info:</h2>
        </div>
        {errors.messages && errors.messages.length !== 0 && (
          <div className="row d-flex justify-content-center">
            <div className="alert alert-danger mt-4 mb-4 col-4">
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
            className="col-4 border border-muted rounded p-4"
          >
            <fieldset className="mb-4">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                value={requestBody.username}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                value={requestBody.email}
                onChange={handleChange}
              />
            </fieldset>
            <button type="submit" className="btn btn-dark me-2">
              Submit
            </button>
            <Link type="button" className="btn btn-dark" to={"/profile"}>
              Cancel
            </Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditUserInfoForm;
