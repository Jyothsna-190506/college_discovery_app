import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CollegeDetails from "./pages/CollegeDetails";
import Compare from "./pages/Compare";
import Predictor from "./pages/Predictor";
import Discussion from "./pages/Discussion";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges/:id" element={<CollegeDetails />} />
              {/* Fallback alias for singular route */}
              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/predictor" element={<Predictor />} />
              <Route path="/discussion" element={<Discussion />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white-50 py-4 mt-auto border-top border-secondary">
            <div className="container text-center small">
              <p className="mb-1 text-white fw-bold">🎓 CollegeFinder — Empowering Students with Real College Insights</p>
              <p className="mb-0">
                Built with Express.js, MongoDB, React, and Bootstrap. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
