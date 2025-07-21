import { Route, BrowserRouter, Routes } from "react-router-dom";
import Calendar from "./Calendar";

function App() {
  return (
    <BrowserRouter>
      <h1>Workout Tracker Fitstack</h1>
      <Routes>
        <Route path="/calendar" element={<Calendar />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
