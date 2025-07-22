import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile";
import LogForm from "./LogForm";
import RoutineForm from "./RoutineForm";
import UserForm from "./UserForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/registration" element={<Registration/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/log/add" element={<LogForm/>}></Route>
        <Route path="/routine/add" element={<RoutineForm/>}></Route>
        <Route path="/edit" element={<UserForm/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
