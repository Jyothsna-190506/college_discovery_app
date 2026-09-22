import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top py-2">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="fs-3 me-2">🎓</span>
          <span>College<span className="text-warning">Finder</span></span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links & Auth */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Explore Colleges
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/predictor">
                🧠 Predictor
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/compare">
                📊 Compare
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/discussion">
                💬 Discussion Forum
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                >
                  <span>❤️</span>
                  <span>Favorites</span>
                  {user.favorites && user.favorites.length > 0 && (
                    <span className="badge bg-danger rounded-pill ms-1">
                      {user.favorites.length}
                    </span>
                  )}
                </Link>

                <div className="d-flex align-items-center text-white bg-primary-subtle px-3 py-1 rounded-pill border border-light-subtle">
                  <img
                    src={
                      user.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                    alt="avatar"
                    className="rounded-circle me-2"
                    style={{ width: "26px", height: "26px", objectFit: "cover" }}
                  />
                  <span className="small fw-semibold text-white">
                    {user.name.split(" ")[0]}
                  </span>
                  {user.role === "admin" && (
                    <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "10px" }}>
                      ADMIN
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-warning btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm fw-bold">
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
