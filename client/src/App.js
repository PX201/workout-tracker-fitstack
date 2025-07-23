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
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";

function App() {
  const userRole = sessionStorage.getItem("user_role");
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* TODO: if user not login display this routes only: '/', '/login', '/register',  '/*' (Not found page)*/}
        {/* TODO: if user loged in as USER display user routes:   '/profile', '/edit', '/log',/calendar, '/routine' ..  */}
        {/* TODO: if user loged in as ADMIN display user/admin routes: "/admin/routines", "/admin/users", '/profile', '/edit', '/log',/calendar, '/routine' ..  */}
          {!userRole ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/login/:username" element={<Login/>}></Route>
              <Route path="/registration" element={<Registration/>}></Route>
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/log/add" element={<LogForm />} />
              <Route path="/routine/add" element={<RoutineForm />} />
              <Route path="/edit" element={<UserForm />} />
              <Route path="/body" element={<BodyHighlighter />} />
              <Route path="/calendar" element={<Calendar />} />
            </>
          )}

          {userRole === "ADMIN" && (
            <>
              <Route path="/admin/users" element={<AdminUserList />} />
              <Route path="/admin/routines" element={<AdminRoutineList />} />
            </>
          )}

        <Route path="/*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
