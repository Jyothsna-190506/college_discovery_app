import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feeFilter, setFeeFilter] = useState("");
  const [sortOption, setSortOption] = useState("ranking_asc");
  const [selected, setSelected] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (feeFilter) params.feeFilter = feeFilter;
      if (sortOption) params.sort = sortOption;

      const res = await API.get("/colleges", { params });
      if (res.data.success) {
        setColleges(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load colleges", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchColleges();
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, feeFilter, sortOption]);

  const handleFavoriteClick = async (collegeId, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to save colleges to your favorites!");
      navigate("/login");
      return;
    }
    try {
      const res = await toggleFavorite(collegeId);
      showToast(res.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSelectCompare = (college, e) => {
    e.stopPropagation();
    const exists = selected.find((c) => c._id === college._id);
    if (exists) {
      setSelected(selected.filter((c) => c._id !== college._id));
    } else {
      if (selected.length >= 4) {
        alert("You can compare a maximum of 4 colleges at a time");
        return;
      }
      setSelected([...selected, college]);
    }
  };

  return (
    <div className="pb-5" style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      {/* 🔷 HERO SECTION */}
      <div
        className="text-white py-5 px-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        }}
      >
        <div className="container text-center py-4">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
            ✨ India's Premier College Discovery Portal
          </span>
          <h1 className="display-5 fw-bold mb-3">Find & Compare Your Dream College</h1>
          <p className="lead text-light mb-4 mx-auto" style={{ maxWidth: "650px" }}>
            Explore NIRF rankings, accurate cutoffs, fees, placement CTCs, and verified student reviews across top Indian engineering & research institutes.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-warning btn-lg fw-bold px-4 shadow"
              onClick={() => navigate("/predictor")}
            >
              🧠 Try College Predictor
            </button>
            <button
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => navigate("/compare")}
            >
              📊 Compare Colleges
            </button>
            <button
              className="btn btn-outline-info btn-lg px-4"
              onClick={() => navigate("/discussion")}
            >
              💬 Discussion Forum
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="alert alert-success shadow-sm alert-dismissible fade show mb-4" role="alert">
            ⭐ {toastMsg}
          </div>
        )}

        {/* 🔍 SEARCH + FILTER TOOLBAR */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
          <div className="row g-3 align-items-center">
            <div className="col-lg-5 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by college name, city, state, or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-3">
              <select
                className="form-select"
                value={feeFilter}
                onChange={(e) => setFeeFilter(e.target.value)}
              >
                <option value="">💰 All Fee Ranges</option>
                <option value="low">Annual Fee &lt; ₹2 Lakhs</option>
                <option value="high">Annual Fee &gt;= ₹2 Lakhs</option>
              </select>
            </div>

            <div className="col-lg-4 col-md-3">
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="ranking_asc">🏆 Top NIRF Ranking First</option>
                <option value="rating_desc">⭐ Highest Student Rating</option>
                <option value="package_desc">💼 Highest Average CTC</option>
                <option value="fees_asc">💵 Lowest Fees First</option>
                <option value="fees_desc">💎 Premium / High Fees</option>
              </select>
            </div>
          </div>
        </div>

        {/* 📋 RESULTS HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-secondary mb-0">
            Found <strong className="text-dark">{colleges.length}</strong> Premier Colleges
          </h5>

          {selected.length > 0 && (
            <button
              className="btn btn-primary btn-sm shadow-sm"
              onClick={() => navigate("/compare", { state: selected })}
            >
              Compare Selected ({selected.length}/4) ➔
            </button>
          )}
        </div>

        {/* 🧱 COLLEGE CARDS GRID */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading top colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="fs-1 mb-2">🔍</div>
            <h4>No colleges found</h4>
            <p className="text-muted">Try adjusting your search criteria or fee filters.</p>
            <button
              className="btn btn-outline-primary btn-sm mx-auto"
              onClick={() => {
                setSearch("");
                setFeeFilter("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {colleges.map((c) => {
              const favorited = isFavorite(c._id);
              const isSelected = selected.some((s) => s._id === c._id);

              return (
                <div className="col-lg-4 col-md-6" key={c._id}>
                  <div
                    className={`card h-100 border-0 shadow-sm rounded-3 overflow-hidden transition-all ${
                      isSelected ? "border border-2 border-primary" : ""
                    }`}
                    onClick={() => navigate(`/colleges/${c._id}`)}
                    style={{ cursor: "pointer", transition: "transform 0.15s ease-in-out" }}
                  >
                    {/* 🖼️ IMAGE WITH BADGES */}
                    <div style={{ position: "relative", height: "190px" }}>
                      <img
                        src={
                          c.image ||
                          "https://images.unsplash.com/photo-1562774053-701939374585?w=800"
                        }
                        alt={c.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />

                      {/* Rank Badge */}
                      <span
                        className="badge bg-dark bg-opacity-75 text-warning position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill"
                        style={{ backdropFilter: "blur(4px)" }}
                      >
                        🏆 NIRF #{c.ranking}
                      </span>

                      {/* Favorite Button */}
                      <button
                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                        style={{ width: "36px", height: "36px", padding: 0 }}
                        onClick={(e) => handleFavoriteClick(c._id, e)}
                        title={favorited ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        {favorited ? "❤️" : "🤍"}
                      </button>

                      {/* College Type Badge */}
                      <span
                        className="badge bg-primary bg-opacity-90 position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded"
                        style={{ fontSize: "11px" }}
                      >
                        {c.type}
                      </span>
                    </div>

                    {/* 📄 BODY */}
                    <div className="card-body d-flex flex-column p-3">
                      <h5 className="card-title fw-bold text-dark mb-1 text-truncate" title={c.name}>
                        {c.name}
                      </h5>
                      <p className="text-muted small mb-2">📍 {c.location}</p>

                      {/* Rating & Stats */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-success">
                          ★ {c.ratingsAverage || 4.5}
                        </span>
                        <span className="text-muted small">
                          ({c.ratingsQuantity || 0} reviews)
                        </span>
                      </div>

                      <div className="bg-light p-2 rounded-2 mb-3 small">
                        <div className="row text-center g-1">
                          <div className="col-4 border-end">
                            <span className="text-muted d-block" style={{ fontSize: "11px" }}>Fees/Year</span>
                            <strong className="text-dark">₹{(c.fees / 100000).toFixed(1)}L</strong>
                          </div>
                          <div className="col-4 border-end">
                            <span className="text-muted d-block" style={{ fontSize: "11px" }}>Avg CTC</span>
                            <strong className="text-success">₹{c.averagePackage} LPA</strong>
                          </div>
                          <div className="col-4">
                            <span className="text-muted d-block" style={{ fontSize: "11px" }}>Placement</span>
                            <strong className="text-primary">{c.placementRate}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* FOOTER ACTIONS */}
                      <div className="mt-auto pt-2 d-flex justify-content-between align-items-center border-top">
                        <div
                          className="form-check m-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`compare-${c._id}`}
                            checked={isSelected}
                            onChange={(e) => handleSelectCompare(c, e)}
                          />
                          <label
                            className="form-check-label small text-secondary"
                            htmlFor={`compare-${c._id}`}
                          >
                            Compare
                          </label>
                        </div>

                        <span className="text-primary fw-semibold small">
                          View Details ➔
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📌 FLOATING COMPARE TRAY */}
      {selected.length > 0 && (
        <div
          className="fixed-bottom bg-white border-top shadow-lg py-3 px-4"
          style={{ zIndex: 1050 }}
        >
          <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">Comparing ({selected.length}/4 colleges):</span>
              <div className="d-flex gap-1 flex-wrap">
                {selected.map((col) => (
                  <span
                    key={col._id}
                    className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"
                  >
                    {col.name.split(" ")[0]}
                    <button
                      type="button"
                      className="btn-close ms-1"
                      style={{ fontSize: "8px" }}
                      aria-label="Remove"
                      onClick={() => setSelected(selected.filter((s) => s._id !== col._id))}
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelected([])}
              >
                Clear All
              </button>
              <button
                className="btn btn-primary fw-bold"
                disabled={selected.length < 2}
                onClick={() => navigate("/compare", { state: selected })}
              >
                Compare Now ({selected.length}) ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
