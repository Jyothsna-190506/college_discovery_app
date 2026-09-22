import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "student") {
      setEmail("student@collegefinder.com");
      setPassword("student123");
    } else {
      setEmail("admin@collegefinder.com");
      setPassword("admin123");
    }
    setError("");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "calc(100vh - 65px)",
      }}
    >
      <div className="card border-0 shadow rounded-4 p-4 p-md-5" style={{ maxWidth: "440px", width: "100%" }}>
        <div className="text-center mb-4">
          <span className="fs-1">🎓</span>
          <h3 className="fw-bold mt-2 mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to access your saved colleges & forum discussions</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg fs-6"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg fs-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill */}
        <div className="p-3 bg-light rounded-3 mb-3 border text-center">
          <small className="text-muted d-block fw-semibold mb-2">⚡ Quick 1-Click Demo Testing</small>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => fillDemo("student")}
            >
              👤 Demo Student
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={() => fillDemo("admin")}
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-primary fw-semibold small text-decoration-none">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
