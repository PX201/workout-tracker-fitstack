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
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";
import Footer from "./Footer";

function App() {
  const userRole = sessionStorage.getItem("user_role");
  return (
    <BrowserRouter>
     <div className="d-flex flex-column min-vh-100">
      <Navbar/>
      <main className="flex-fill container py-4">
      <Routes>
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
              <Route path="/log/edit/:logId" element={<EditLogForm />} />
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
              <Route path="/admin/routines/:routineId" element={<AdminRoutineList />} />
            </>
          )}

        <Route path="/*" element={<NotFound/>}></Route>
      </Routes>
      </main>
      <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
