import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();

  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Review Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchCollege = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/colleges/${id}`);
      if (res.data.success) {
        setCollege(res.data.data);
        setReviews(res.data.reviews || []);
        setRelated(res.data.related || []);
      }
    } catch (err) {
      console.error("Error fetching college details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a review!");
      navigate("/login");
      return;
    }
    if (!comment) {
      alert("Please enter your review feedback.");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await API.post("/reviews", {
        collegeId: id,
        rating: Number(rating),
        title,
        comment,
        pros,
        cons,
      });

      if (res.data.success) {
        setReviewSuccess(res.data.message);
        setTitle("");
        setComment("");
        setPros("");
        setCons("");
        fetchCollege(); // Reload reviews and updated rating
        setTimeout(() => setReviewSuccess(""), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please log in to add this college to favorites");
      navigate("/login");
      return;
    }
    await toggleFavorite(college._id);
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading college details...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="container py-5 text-center">
        <h3>College not found</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Back to Explore
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(college._id);

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }} className="pb-5">
      {/* 🖼️ HERO BANNER */}
      <div
        style={{
          position: "relative",
          height: "380px",
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url(${
            college.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=1200"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="d-flex align-items-end text-white"
      >
        <div className="container pb-4">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill">
                  🏆 NIRF #{college.ranking} in India
                </span>
                <span className="badge bg-info bg-opacity-75 text-white px-3 py-1 rounded-pill">
                  {college.type}
                </span>
                {college.establishedYear && (
                  <span className="badge bg-secondary px-3 py-1 rounded-pill">
                    Est. {college.establishedYear}
                  </span>
                )}
              </div>
              <h1 className="display-6 fw-bold mb-1">{college.name}</h1>
              <p className="lead text-light mb-0">📍 {college.location}</p>
            </div>

            <div className="d-flex gap-2">
              <button
                className={`btn ${
                  favorited ? "btn-danger" : "btn-outline-light"
                } d-flex align-items-center gap-2`}
                onClick={handleFavoriteClick}
              >
                <span>{favorited ? "❤️ Saved in Favorites" : "🤍 Add to Favorites"}</span>
              </button>
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning fw-semibold"
                >
                  Official Site ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 KEY STATS BAR */}
      <div className="bg-white shadow-sm border-bottom py-3">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-md-3 col-6 border-end">
              <span className="text-muted small d-block">Annual Tuition Fees</span>
              <h4 className="fw-bold text-dark mb-0">₹{(college.fees / 100000).toFixed(1)} Lakhs</h4>
            </div>
            <div className="col-md-3 col-6 border-end">
              <span className="text-muted small d-block">Average CTC Package</span>
              <h4 className="fw-bold text-success mb-0">₹{college.averagePackage} LPA</h4>
            </div>
            <div className="col-md-3 col-6 border-end">
              <span className="text-muted small d-block">Highest Package</span>
              <h4 className="fw-bold text-primary mb-0">₹{college.highestPackage} LPA</h4>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block">Placement Rate</span>
              <h4 className="fw-bold text-info mb-0">{college.placementRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 🗂️ TABS & CONTENT */}
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Tab navigation buttons */}
            <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 shadow-sm">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "overview" ? "active fw-bold" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  🏫 Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "courses" ? "active fw-bold" : ""}`}
                  onClick={() => setActiveTab("courses")}
                >
                  📘 Courses & Fees
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "cutoffs" ? "active fw-bold" : ""}`}
                  onClick={() => setActiveTab("cutoffs")}
                >
                  🎯 Cutoffs
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "reviews" ? "active fw-bold" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  ⭐ Reviews ({reviews.length})
                </button>
              </li>
            </ul>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="card border-0 shadow-sm p-4 rounded-3 mb-4">
                <h4 className="fw-bold mb-3">About {college.name}</h4>
                <p className="text-secondary leading-relaxed">
                  {college.description ||
                    `${college.name} is one of India's premier higher education and technological institutions, offering top-tier academic curriculum, research facilities, and prominent alumni networks.`}
                </p>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">Campus & Infrastructure Facilities</h5>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {(college.facilities || [
                    "Hostels",
                    "High-Speed Wi-Fi",
                    "Sports Complex",
                    "Central Library",
                    "Laboratories",
                  ]).map((fac, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark border px-3 py-2 rounded-pill"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>

                <h5 className="fw-bold mb-3">Top Recruiting Companies</h5>
                <div className="d-flex flex-wrap gap-2">
                  {(college.topRecruiters || ["Google", "Microsoft", "Amazon", "Goldman Sachs"]).map(
                    (company, idx) => (
                      <span
                        key={idx}
                        className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold"
                      >
                        💼 {company}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: COURSES & FEES */}
            {activeTab === "courses" && (
              <div className="card border-0 shadow-sm p-4 rounded-3 mb-4">
                <h4 className="fw-bold mb-3">Academic Degrees & Programs</h4>
                {college.courses && college.courses.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Course Name</th>
                          <th>Degree</th>
                          <th>Duration</th>
                          <th>Annual Fee</th>
                          <th>Eligibility Exam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.courses.map((course, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold text-dark">{course.name}</td>
                            <td>
                              <span className="badge bg-secondary-subtle text-dark">
                                {course.degree}
                              </span>
                            </td>
                            <td>{course.duration}</td>
                            <td className="text-success fw-bold">
                              ₹{(course.annualFee || college.fees).toLocaleString("en-IN")}
                            </td>
                            <td>
                              <span className="badge bg-primary">
                                {course.eligibility || "JEE / National Entrance"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Detailed course breakdown updating soon.</p>
                )}
              </div>
            )}

            {/* TAB 3: CUTOFFS */}
            {activeTab === "cutoffs" && (
              <div className="card border-0 shadow-sm p-4 rounded-3 mb-4">
                <h4 className="fw-bold mb-3">Previous Year Closing Ranks / Cutoffs</h4>
                <p className="text-muted small mb-3">
                  These cutoffs are reference closing ranks for various entrance examinations and categories.
                </p>

                {college.cutoffs && college.cutoffs.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Exam</th>
                          <th>Specialization / Branch</th>
                          <th>Category</th>
                          <th>Closing Rank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {college.cutoffs.map((cutoff, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className="badge bg-dark text-warning">
                                {cutoff.exam}
                              </span>
                            </td>
                            <td className="fw-semibold">{cutoff.branch}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {cutoff.category}
                              </span>
                            </td>
                            <td className="fw-bold text-danger">#{cutoff.closingRank}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Cutoff data is being verified for this college.</p>
                )}
              </div>
            )}

            {/* TAB 4: REVIEWS & RATINGS */}
            {activeTab === "reviews" && (
              <div className="card border-0 shadow-sm p-4 rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h4 className="fw-bold mb-0">Student Reviews & Experiences</h4>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3 fw-bold text-success">
                      ★ {college.ratingsAverage || 4.5}
                    </span>
                    <span className="text-muted">({reviews.length} total reviews)</span>
                  </div>
                </div>

                {reviewSuccess && (
                  <div className="alert alert-success">{reviewSuccess}</div>
                )}

                {/* Submit Review Form */}
                <div className="bg-light p-4 rounded-3 mb-4 border">
                  <h5 className="fw-bold mb-3">✍️ Write a Student Review</h5>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Rating (1 to 5 Stars)</label>
                        <select
                          className="form-select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="5">★★★★★ (5/5) Excellent</option>
                          <option value="4">★★★★☆ (4/5) Very Good</option>
                          <option value="3">★★★☆☆ (3/5) Average</option>
                          <option value="2">★★☆☆☆ (2/5) Below Average</option>
                          <option value="1">★☆☆☆☆ (1/5) Poor</option>
                        </select>
                      </div>

                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Review Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Incredible placements and coding atmosphere"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Your Detailed Feedback *</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Share your authentic experiences about faculty, campus life, hostels, and placements..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="👍 Pros: (e.g. High placements, green campus)"
                          value={pros}
                          onChange={(e) => setPros(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="👎 Cons: (e.g. High academic workload)"
                          value={cons}
                          onChange={(e) => setCons(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submittingReview}
                    >
                      {submittingReview ? "Submitting..." : "Submit Student Review"}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <p className="text-muted text-center py-4">
                    No reviews submitted yet. Be the first student to review {college.name}!
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="p-3 bg-white border rounded-3 shadow-sm"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-warning text-dark">
                              ★ {rev.rating} / 5
                            </span>
                            <strong className="text-dark">{rev.userName}</strong>
                          </div>
                          <small className="text-muted">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        {rev.title && (
                          <h6 className="fw-bold mb-1 text-primary">{rev.title}</h6>
                        )}
                        <p className="mb-2 text-secondary">{rev.comment}</p>

                        {(rev.pros || rev.cons) && (
                          <div className="small pt-2 border-top mt-2">
                            {rev.pros && (
                              <p className="mb-1 text-success">
                                <strong>Pros:</strong> {rev.pros}
                              </p>
                            )}
                            {rev.cons && (
                              <p className="mb-0 text-danger">
                                <strong>Cons:</strong> {rev.cons}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR: RELATED COLLEGES */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-3 sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3">🏛️ Similar Top Colleges</h5>
              {related.length === 0 ? (
                <p className="text-muted small">No related institutions found.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {related.map((rel) => (
                    <div
                      key={rel._id}
                      className="d-flex align-items-center gap-3 p-2 rounded-2 border hover-shadow"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/colleges/${rel._id}`)}
                    >
                      <img
                        src={rel.image || "https://images.unsplash.com/photo-1562774053-701939374585?w=200"}
                        alt={rel.name}
                        className="rounded"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <div className="overflow-hidden">
                        <h6 className="fw-bold text-truncate mb-1">{rel.name}</h6>
                        <span className="badge bg-warning text-dark me-2">
                          #{rel.ranking} NIRF
                        </span>
                        <span className="text-success small fw-semibold">
                          ₹{rel.averagePackage} LPA
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr className="my-3" />

              <button
                className="btn btn-primary w-100 fw-bold py-2"
                onClick={() => navigate("/compare", { state: [college] })}
              >
                Compare With Other Colleges ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDetails;
