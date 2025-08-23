import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "./components/UserInfo";

const DEFAULT_REQUEST_BODY = {
  currentPassword: "",
  newPassword: "",
  repeatNewPassword: "",
};

const PasswordChangeForm = () => {
  const [requestBody, setRequestBody] = useState(DEFAULT_REQUEST_BODY);
  const [errors, setErrors] = useState([]);
  const changePasswordUrl = `${BASE_API_URL}/user/me/changepassword`;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRequestBody((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (requestBody.newPassword !== requestBody.repeatNewPassword) {
      setErrors({
        messages: ["Passwords do not match"],
        timestamp: Date.now(),
      });
      return;
    }

    // build payload without mutating state
    const { currentPassword, newPassword } = requestBody;
    const payload = { currentPassword, newPassword };

    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
      body: JSON.stringify(payload),
    };

    fetch(changePasswordUrl, init)
      .then((r) =>
        r.status === 200
          ? null
          : r.status === 400
          ? r.json()
          : Promise.reject(r.status)
      )
      .then((data) => {
        if (!data) {
          alert("Password updated successfully!");
          sessionStorage.clear();
          window.location.href = "/"; // go to login
        } else if (data.messages) {
          setErrors(data);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <h2 className="app-title">Change Password</h2>

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
            <label htmlFor="currentPassword" className="form-label">
              Old password
            </label>
            <input
              type="password"
              className="form-control"
              id="currentPassword"
              autoComplete="current-password"
              onChange={handleChange}
              value={requestBody.currentPassword}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              autoComplete="new-password"
              onChange={handleChange}
              value={requestBody.newPassword}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="repeatNewPassword" className="form-label">
              Repeat new password
            </label>
            <input
              type="password"
              className="form-control"
              id="repeatNewPassword"
              autoComplete="new-password"
              onChange={handleChange}
              value={requestBody.repeatNewPassword}
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

export default PasswordChangeForm;
