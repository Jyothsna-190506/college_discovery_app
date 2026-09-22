import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Favorites() {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/favorites");
      if (res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRemove = async (collegeId, e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(collegeId);
      setFavorites(favorites.filter((c) => c._id !== collegeId));
    } catch (err) {
      alert("Failed to remove favorite");
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }} className="pb-5">
      {/* 🔷 HEADER */}
      <div
        className="text-white py-4 px-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #d31027 0%, #ea384d 100%)",
        }}
      >
        <div className="container py-2 text-center">
          <h1 className="fw-bold mb-2">❤️ My Saved Favorite Colleges</h1>
          <p className="lead text-light mb-0">
            Keep track of your shortlisted colleges, cutoffs, and fees for quick decision making.
          </p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-3">
            <div className="fs-1 mb-2">💔</div>
            <h4>You haven't saved any colleges yet</h4>
            <p className="text-muted">
              Click the ❤️ icon on any college card to shortlist colleges for easy tracking.
            </p>
            <Link to="/" className="btn btn-primary mx-auto">
              Explore Colleges Now ➔
            </Link>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-secondary mb-0">
                You have shortlisted <strong>{favorites.length}</strong> colleges
              </h5>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/compare", { state: favorites.slice(0, 4) })}
                disabled={favorites.length < 2}
              >
                Compare Shortlist ➔
              </button>
            </div>

            <div className="row g-4">
              {favorites.map((c) => (
                <div className="col-lg-4 col-md-6" key={c._id}>
                  <div
                    className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
                    onClick={() => navigate(`/colleges/${c._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ position: "relative", height: "180px" }}>
                      <img
                        src={
                          c.image ||
                          "https://images.unsplash.com/photo-1562774053-701939374585?w=600"
                        }
                        alt={c.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                        style={{ width: "36px", height: "36px", padding: 0 }}
                        onClick={(e) => handleRemove(c._id, e)}
                        title="Remove from favorites"
                      >
                        ✕
                      </button>
                      <span className="badge bg-dark text-warning position-absolute top-0 start-0 m-3">
                        NIRF #{c.ranking}
                      </span>
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                      <h5 className="card-title fw-bold text-dark mb-1 text-truncate">
                        {c.name}
                      </h5>
                      <p className="text-muted small mb-3">📍 {c.location}</p>

                      <div className="bg-light p-2 rounded small mb-3">
                        <div className="d-flex justify-content-between text-secondary">
                          <span>Annual Fees: <strong>₹{(c.fees / 100000).toFixed(1)}L</strong></span>
                          <span className="text-success fw-bold">Avg ₹{c.averagePackage} LPA</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="badge bg-success">
                          ★ {c.ratingsAverage || 4.5}
                        </span>
                        <span className="text-primary small fw-semibold">
                          View College ➔
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
