export const DEFAULT_USER = {
  userId: 0,
  username: "<username>",
  email: "<email>",
  password: "",
  role: "USER",
  dateJoined: Date.now(),
  active: true
};


const API_URL = process.env.REACT_APP_API_URL;

export const BASE_API_URL = `http://${API_URL}:8080/api`;