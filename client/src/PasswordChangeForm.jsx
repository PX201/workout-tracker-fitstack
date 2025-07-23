import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

    const BASE_URL = `http://localhost:8080/api`;
    const DEFAULT_REQUEST_BODY = {
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: ""
    }

const PasswordChangeForm = () => {
    const navigate = useNavigate();

    const [requestBody, setRequestBody] = useState(DEFAULT_REQUEST_BODY);
    const changePasswordUrl = `${BASE_URL}/user/me/changepassword`;
    const [errors, setErrors] = useState([]);


    const handleChange = (event) => {
    const newRequestBody = { ...requestBody };
    newRequestBody[event.target.id] = event.target.value;
    setRequestBody(newRequestBody);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (requestBody.newPassword !== requestBody.repeatNewPassword) {
      setErrors({
        messages: ["Passwords do not match"],
        timestamp: Date.now(),
      });
      return;
    }
    delete requestBody.repeatNewPassword;

    // HTTP change the password
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(requestBody),
    };
    fetch(changePasswordUrl, init)
      .then((response) => {
        if (response.status === 200) {
          return null;
        } else if (response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      })
      .then((data) => {
        if (!data) {
        // successful navigate to login page 
          navigate('/');
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
          <h2>Change Password</h2>
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
              <label htmlFor="currentPassword">Old password</label>
              <input
                type="password"
                className="form-control"
                name="currentPassword"
                id="currentPassword"
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="newPassword">New password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                id="newPassword"
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="repeatNewPassword">Repeat new password</label>
              <input
                type="password"
                className="form-control"
                name="repeatNewPassword"
                id="repeatNewPassword"
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

export default PasswordChangeForm;
