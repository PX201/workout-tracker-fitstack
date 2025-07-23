import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile";
import LogForm from "./LogForm";
import RoutineForm from "./RoutineForm";
import UserForm from "./UserForm";
import BodyHighlighter from "./BodyHighlighter";
import Calendar from "./Calendar";
import AdminUserList from "./AdminUserList";
import AdminRoutineList from "./AdminRoutineList";
import EditLogForm from "./EditLogForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/login/:username" element={<Login/>}></Route>
        <Route path="/registration" element={<Registration/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/log/add" element={<LogForm/>}></Route>
        <Route path="/log/edit/:logId" element={<EditLogForm />} />
        <Route path="/routine/add" element={<RoutineForm/>}></Route>
        <Route path="/edit" element={<UserForm/>}></Route>
        <Route path="/body" element={<BodyHighlighter />}></Route>
        <Route path="/calendar" element={<Calendar />}></Route>
        <Route path="/admin/users" element={<AdminUserList />}></Route>
        <Route path="/admin/routines" element={<AdminRoutineList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
