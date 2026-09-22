import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "calc(100vh - 65px)",
      }}
    >
      <div className="card border-0 shadow rounded-4 p-4 p-md-5" style={{ maxWidth: "460px", width: "100%" }}>
        <div className="text-center mb-4">
          <span className="fs-1">🚀</span>
          <h3 className="fw-bold mt-2 mb-1">Create an Account</h3>
          <p className="text-muted small">
            Join thousands of students finding their dream colleges & courses
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Password * (Min 6 chars)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Confirm Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
