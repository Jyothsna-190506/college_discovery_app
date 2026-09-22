import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Compare() {
  const location = useLocation();
  const navigate = useNavigate();

  const [colleges, setColleges] = useState(location.state || []);
  const [allColleges, setAllColleges] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState("");

  // Fetch all colleges to allow adding more colleges directly on this page
  useEffect(() => {
    const loadAllColleges = async () => {
      try {
        const res = await API.get("/colleges?limit=50");
        if (res.data.success) {
          setAllColleges(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load colleges for comparison", err);
      }
    };
    loadAllColleges();
  }, []);

  const handleAddCollege = () => {
    if (!selectedToAdd) return;
    if (colleges.length >= 4) {
      alert("You can compare up to 4 colleges at a time");
      return;
    }
    const col = allColleges.find((c) => c._id === selectedToAdd);
    if (col && !colleges.some((c) => c._id === col._id)) {
      setColleges([...colleges, col]);
      setSelectedToAdd("");
    }
  };

  const handleRemove = (id) => {
    setColleges(colleges.filter((c) => c._id !== id));
  };

  // Compute best in category
  const minFee = Math.min(...colleges.map((c) => c.fees || Infinity));
  const maxAvgPkg = Math.max(...colleges.map((c) => c.averagePackage || 0));
  const maxPlacement = Math.max(...colleges.map((c) => c.placementRate || 0));
  const bestRank = Math.min(...colleges.map((c) => c.ranking || Infinity));

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }} className="pb-5">
      {/* 🔷 HEADER */}
      <div
        className="text-white py-4 px-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
        }}
      >
        <div className="container py-2 text-center">
          <h1 className="fw-bold mb-2">📊 Comprehensive College Comparison</h1>
          <p className="lead text-light mb-0 mx-auto" style={{ maxWidth: "650px" }}>
            Compare curriculum, fees, placements, ROI, and student ratings side-by-side to make an informed career decision.
          </p>
        </div>
      </div>

      <div className="container">
        {/* ADD MORE COLLEGES BAR */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">Comparing {colleges.length}/4 Colleges</span>
            {colleges.length < 2 && (
              <span className="badge bg-warning text-dark">
                ⚠️ Select at least 2 colleges to compare
              </span>
            )}
          </div>

          <div className="d-flex gap-2">
            <select
              className="form-select"
              style={{ minWidth: "260px" }}
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              disabled={colleges.length >= 4}
            >
              <option value="">➕ Add College to Compare...</option>
              {allColleges
                .filter((c) => !colleges.some((sel) => sel._id === c._id))
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (NIRF #{c.ranking})
                  </option>
                ))}
            </select>
            <button
              className="btn btn-primary fw-semibold"
              onClick={handleAddCollege}
              disabled={!selectedToAdd || colleges.length >= 4}
            >
              Add
            </button>
          </div>
        </div>

        {colleges.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-3">
            <h3>No colleges selected for comparison</h3>
            <p className="text-muted">
              Explore colleges on the home page and check "Compare", or select a college from the dropdown above.
            </p>
            <Link to="/" className="btn btn-primary mx-auto">
              Browse Colleges ➔
            </Link>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle mb-0 text-center">
                {/* HEADER ROW WITH COLLEGE CARDS */}
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "20%", verticalAlign: "middle" }} className="text-start ps-4">
                      Metrics & Features
                    </th>
                    {colleges.map((c) => (
                      <th key={c._id} style={{ width: `${80 / colleges.length}%` }} className="p-3">
                        <div className="position-relative">
                          <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0"
                            aria-label="Remove"
                            onClick={() => handleRemove(c._id)}
                            title="Remove from comparison"
                          ></button>

                          <img
                            src={c.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=300"}
                            alt={c.name}
                            className="rounded mb-2"
                            style={{ width: "100%", height: "110px", objectFit: "cover" }}
                          />

                          <h6 className="fw-bold text-dark mb-1" style={{ minHeight: "38px" }}>
                            {c.name}
                          </h6>
                          <p className="text-muted small mb-2">📍 {c.location}</p>

                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={() => navigate(`/colleges/${c._id}`)}
                          >
                            View Details ➔
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* NIRF RANKING */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      🏆 NIRF Ranking
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id}>
                        <span
                          className={`badge ${
                            c.ranking === bestRank ? "bg-success fs-6" : "bg-dark"
                          }`}
                        >
                          #{c.ranking} in India
                          {c.ranking === bestRank && " (Top Ranked)"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* ANNUAL TUITION FEES */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      💰 Annual Tuition Fees
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id}>
                        <span className="fw-bold text-dark">
                          ₹{c.fees.toLocaleString("en-IN")}
                        </span>
                        {c.fees === minFee && (
                          <div className="badge bg-success-subtle text-success border border-success-subtle d-block mx-auto mt-1" style={{ maxWidth: "120px" }}>
                            Best Value
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* AVERAGE CTC PACKAGE */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      💼 Average CTC (Salary)
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id}>
                        <span className="fw-bold text-success fs-6">
                          ₹{c.averagePackage} LPA
                        </span>
                        {c.averagePackage === maxAvgPkg && (
                          <div className="badge bg-primary-subtle text-primary border border-primary-subtle d-block mx-auto mt-1" style={{ maxWidth: "120px" }}>
                            Highest Average
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* HIGHEST CTC PACKAGE */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      🚀 Highest Package
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id} className="fw-bold text-primary">
                        ₹{c.highestPackage} LPA
                      </td>
                    ))}
                  </tr>

                  {/* PLACEMENT PERCENTAGE */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      📈 Placement Rate
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id}>
                        <span className="fw-bold text-info fs-6">
                          {c.placementRate}%
                        </span>
                        {c.placementRate === maxPlacement && (
                          <div className="badge bg-info-subtle text-info border border-info-subtle d-block mx-auto mt-1" style={{ maxWidth: "120px" }}>
                            Top Placement
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* STUDENT RATING */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      ⭐ Student Rating
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id}>
                        <span className="badge bg-warning text-dark fs-6">
                          ★ {c.ratingsAverage || 4.5} / 5
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* INSTITUTION TYPE */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      🏛️ Institution Type
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id} className="small text-muted">
                        {c.type}
                      </td>
                    ))}
                  </tr>

                  {/* CAMPUS FACILITIES */}
                  <tr>
                    <td className="text-start ps-4 fw-semibold text-secondary">
                      🏕️ Campus Facilities
                    </td>
                    {colleges.map((c) => (
                      <td key={c._id} className="small">
                        {(c.facilities || []).slice(0, 4).join(" • ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
