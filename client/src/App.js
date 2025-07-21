import { Route, BrowserRouter, Routes } from "react-router-dom";
import BodyHighlighter from "./BodyHighlighter";

function App() {
  return (
    <BrowserRouter>
      <h1>Workout Tracker Fitstack</h1>
      <Routes>
        <Route path="/body" element={<BodyHighlighter />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
