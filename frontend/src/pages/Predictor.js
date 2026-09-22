import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Predictor() {
  const navigate = useNavigate();

  const [exam, setExam] = useState("JEE MAIN");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [branch, setBranch] = useState("");
  const [maxFees, setMaxFees] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeBucket, setActiveBucket] = useState("all");

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!rank || isNaN(rank) || Number(rank) <= 0) {
      alert("Please enter a valid numeric rank!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        exam,
        rank: Number(rank),
        category,
        preferredBranch: branch || undefined,
        maxFees: maxFees ? Number(maxFees) : undefined,
      };

      const res = await API.post("/colleges/predict", payload);
      if (res.data.success) {
        setResults(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to predict colleges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }} className="pb-5">
      {/* 🔷 HEADER */}
      <div
        className="text-white py-4 px-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        }}
      >
        <div className="container py-2 text-center">
          <h1 className="fw-bold mb-2">🧠 Smart College Predictor Engine</h1>
          <p className="lead text-light mb-0 mx-auto" style={{ maxWidth: "680px" }}>
            Enter your entrance examination score or rank to discover high-probability college matches evaluated against historical closing cutoffs and seat matrix.
          </p>
        </div>
      </div>

      <div className="container">
        {/* 🎛️ INPUT FORM */}
        <div className="card border-0 shadow-sm p-4 rounded-3 mb-4">
          <form onSubmit={handlePredict}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold small">Entrance Examination *</label>
                <select
                  className="form-select"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  required
                >
                  <option value="JEE MAIN">JEE Main</option>
                  <option value="JEE ADVANCED">JEE Advanced</option>
                  <option value="BITSAT">BITSAT</option>
                  <option value="WBJEE">WBJEE</option>
                  <option value="MET">MET (Manipal)</option>
                  <option value="VITEEE">VITEEE</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small">Your All India Rank (AIR) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 4500"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">Seat Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="General">General / OPEN</option>
                  <option value="OBC">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">GEN-EWS</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">Branch Filter (Optional)</label>
                <select
                  className="form-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="">All Branches</option>
                  <option value="Computer Science">Computer Science / IT</option>
                  <option value="Electronics">Electronics / ECE</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">Max Annual Budget</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 300000"
                  value={maxFees}
                  onChange={(e) => setMaxFees(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-3 text-end">
              <button
                type="submit"
                className="btn btn-warning btn-lg fw-bold px-4 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Evaluating Cutoffs...
                  </>
                ) : (
                  "Calculate Admissions Probability ➔"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 🎯 PREDICTION RESULTS */}
        {results && (
          <div>
            {/* Summary Statistics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div
                  className={`card border-0 shadow-sm p-3 text-center rounded-3 ${
                    activeBucket === "safe" ? "border border-2 border-success" : ""
                  }`}
                  style={{ backgroundColor: "#e8f5e9", cursor: "pointer" }}
                  onClick={() => setActiveBucket(activeBucket === "safe" ? "all" : "safe")}
                >
                  <span className="badge bg-success mx-auto mb-1">High Probability</span>
                  <h3 className="fw-bold text-success mb-0">{results.summary.safeCount}</h3>
                  <small className="text-muted">Safe Colleges (Closing Rank &gt; Your Rank)</small>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`card border-0 shadow-sm p-3 text-center rounded-3 ${
                    activeBucket === "target" ? "border border-2 border-primary" : ""
                  }`}
                  style={{ backgroundColor: "#e3f2fd", cursor: "pointer" }}
                  onClick={() => setActiveBucket(activeBucket === "target" ? "all" : "target")}
                >
                  <span className="badge bg-primary mx-auto mb-1">Moderate Probability</span>
                  <h3 className="fw-bold text-primary mb-0">{results.summary.targetCount}</h3>
                  <small className="text-muted">Target Colleges (Realistic Cutoff Matches)</small>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`card border-0 shadow-sm p-3 text-center rounded-3 ${
                    activeBucket === "reach" ? "border border-2 border-warning" : ""
                  }`}
                  style={{ backgroundColor: "#fff8e1", cursor: "pointer" }}
                  onClick={() => setActiveBucket(activeBucket === "reach" ? "all" : "reach")}
                >
                  <span className="badge bg-warning text-dark mx-auto mb-1">Aspirational</span>
                  <h3 className="fw-bold text-warning-emphasis mb-0">{results.summary.reachCount}</h3>
                  <small className="text-muted">Reach / Dream Colleges (Competitive Cutoff)</small>
                </div>
              </div>
            </div>

            {/* Results Grid by Category */}
            {results.summary.totalSuggestions === 0 ? (
              <div className="card border-0 shadow-sm p-5 text-center">
                <h5>No colleges found within current filters</h5>
                <p className="text-muted">
                  Try relaxing the branch criteria or increasing your annual fee budget.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {/* 1. SAFE COLLEGES */}
                {(activeBucket === "all" || activeBucket === "safe") &&
                  results.results.safe.length > 0 && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-success fs-6">🟢 Safe Choices</span>
                        <span className="text-muted small">
                          High likelihood of admission based on historical closing trends.
                        </span>
                      </div>
                      <div className="row g-3">
                        {results.results.safe.map((col) => (
                          <div className="col-lg-4 col-md-6" key={col._id}>
                            <CollegePredictCard
                              college={col}
                              badgeClass="bg-success"
                              navigate={navigate}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 2. TARGET COLLEGES */}
                {(activeBucket === "all" || activeBucket === "target") &&
                  results.results.target.length > 0 && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary fs-6">🔵 Target Choices</span>
                        <span className="text-muted small">
                          Balanced odds. Highly recommended to include in counselling preferences.
                        </span>
                      </div>
                      <div className="row g-3">
                        {results.results.target.map((col) => (
                          <div className="col-lg-4 col-md-6" key={col._id}>
                            <CollegePredictCard
                              college={col}
                              badgeClass="bg-primary"
                              navigate={navigate}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 3. REACH COLLEGES */}
                {(activeBucket === "all" || activeBucket === "reach") &&
                  results.results.reach.length > 0 && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-warning text-dark fs-6">🟡 Reach / Dream Choices</span>
                        <span className="text-muted small">
                          Competitive cutoffs. Good candidate for early counselling rounds.
                        </span>
                      </div>
                      <div className="row g-3">
                        {results.results.reach.map((col) => (
                          <div className="col-lg-4 col-md-6" key={col._id}>
                            <CollegePredictCard
                              college={col}
                              badgeClass="bg-warning text-dark"
                              navigate={navigate}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CollegePredictCard({ college, badgeClass, navigate }) {
  return (
    <div
      className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden"
      onClick={() => navigate(`/colleges/${college._id}`)}
      style={{ cursor: "pointer" }}
    >
      <div style={{ position: "relative", height: "150px" }}>
        <img
          src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=500"}
          alt={college.name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <span
          className={`badge ${badgeClass} position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill`}
        >
          {college.probability}% Match
        </span>
        <span className="badge bg-dark bg-opacity-75 text-warning position-absolute top-0 start-0 m-2">
          #{college.ranking} NIRF
        </span>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={college.name}>
          {college.name}
        </h6>
        <p className="text-muted small mb-2">📍 {college.location}</p>

        <div className="bg-light p-2 rounded small mb-3">
          <div className="text-truncate text-secondary">
            <strong>Branch:</strong> {college.matchedBranch}
          </div>
          <div className="d-flex justify-content-between text-secondary mt-1">
            <span>Closing Cutoff: <strong>#{college.closingRank}</strong></span>
            <span className="text-success fw-bold">₹{college.averagePackage} LPA</span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <span className="text-muted small">₹{(college.fees / 100000).toFixed(1)}L/yr</span>
          <span className="text-primary small fw-semibold">View College ➔</span>
        </div>
      </div>
    </div>
  );
}

export default Predictor;
