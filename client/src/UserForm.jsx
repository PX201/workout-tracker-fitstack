import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { DEFAULT_USER, userUrl, userToken } from "./components/userInfo.js" 

function UserForm() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch user info
    const init = { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${userToken}`
      }
    };
    fetch(userUrl, init)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    }).then(data => {
      // initialize duplicate passwords to be equal
      data["repeatPassword"] = data["password"];
      setUser(data);
    });
  }, []);

  const handleChange = (event) => {
    const newUser = { ...user };
    newUser[event.target.id] = event.target.value;
    setUser(newUser);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (user.password !== user.repeatPassword) {
      setErrors({messages: ["Passwords do not match"], timestamp: Date.now()});
      return;
    }
    delete user.repeatPassword;

    // HTTP update username and password
    const init = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({userId: user.userId, email: user.email, username: user.username})
    };
    fetch(userUrl, init)
      .then(response => {
        if (response.status === 200) {  // successful update returns nothing
          return null;
        } else if (response.status === 400) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Error: ${response.status}`);
        }
      }).then(data => {
        if (!data) {
          navigate("/profile");
        } else if (data.messages) {
          user.repeatPassword = user.password;
          setErrors(data);
        }
      }).catch(console.log);
  }

  return (
    <>
      <UserNavbar />
      <section className="container-sm mt-5">
        <div className="text-center mb-4">
          <h2>Edit User:</h2>
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
        <div className="row justify-content-center">
          <form onSubmit={handleSubmit} className="col-4 border border-muted rounded p-4">
            <fieldset className="mb-4">
              <label htmlFor="username">New username</label>
              <input 
                type="text" 
                className="form-control" 
                name="username"
                id="username"
                value={user.username}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="email">New email address</label>
              <input 
                type="email" 
                className="form-control" 
                name="email"
                id="email" 
                value={user.email}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="password">New password</label>
              <input 
                type="password" 
                className="form-control" 
                name="password"
                id="password" 
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="repeatPassword">Repeat new password</label>
              <input 
                type="password" 
                className="form-control" 
                name="repeatPassword"
                id="repeatPassword"
                onChange={handleChange}
              />
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