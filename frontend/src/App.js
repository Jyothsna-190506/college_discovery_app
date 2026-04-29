import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CollegeDetails from "./pages/CollegeDetails";
import Navbar from "./components/Navbar";
import Compare from "./pages/Compare";
import Predictor from "./pages/Predictor";
import Discussion from "./pages/Discussion";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/colleges/:id" element={<CollegeDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/predictor" element={<Predictor />} />
        <Route path="/discussion" element={<Discussion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
