export const DEFAULT_USER = {
  userId: 0,
  username: "<username>",
  email: "<email>",
  password: "",
  role: "USER",
  dateJoined: Date.now(),
  active: true
};

export const userUrl = "http://localhost:8080/api/user/me";
