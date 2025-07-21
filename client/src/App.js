import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/registration" element={<Registration/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
