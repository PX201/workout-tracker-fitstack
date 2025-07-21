import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
