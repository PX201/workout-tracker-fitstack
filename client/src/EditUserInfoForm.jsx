import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

const DEFAULT_REQUEST_BODY = {
  email: `${sessionStorage.getItem("user_email") || ""}`,
  username: `${sessionStorage.getItem("user_username") || ""}`,
};

const EditUserInfoForm = () => {
  const editUserInfoUrl = `${BASE_API_URL}/user/me`;
  const [requestBody, setRequestBody] = useState(DEFAULT_REQUEST_BODY);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRequestBody((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(requestBody),
    };

    fetch(editUserInfoUrl, init)
      .then((r) =>
        r.status === 200
          ? null
          : r.status === 400
          ? r.json()
          : Promise.reject(r.status)
      )
      .then((data) => {
        if (!data) {
          alert("Your account details have been updated successfully!");
          sessionStorage.clear();
          window.location.href = "/";
        } else if (data.messages) {
          setErrors(data);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <h2 className="app-title">Edit User Info</h2>

      {errors.messages?.length ? (
        <div className="alert alert-danger app-alert" role="alert">
          <ul className="mb-0">
            {errors.messages.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="app-card app-card--dark">
        <form onSubmit={handleSubmit} className="app-form">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={requestBody.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={requestBody.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="app-actions mt-2">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
            <Link to="/profile" className="btn btn-outline-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUserInfoForm;
