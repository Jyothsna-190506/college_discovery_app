import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/colleges/${id}`)
      .then((res) => setCollege(res.data));
  }, [id]);

  const fetchReviews = async () => {
    const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const addReview = async () => {
    if (!comment) return alert("Enter review!");

    await axios.post("http://localhost:5000/api/reviews", {
      collegeId: id,
      user: "Student",
      rating: 5,
      comment,
    });

    setComment("");
    fetchReviews();
  };

  if (!college) return <h2 className="p-4">Loading...</h2>;

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      {/* 🔥 BANNER */}
      <div style={{ position: "relative" }}>
        <img
          src={
            college.image ||
            "https://images.unsplash.com/photo-1562774053-701939374585?w=1200"
          }
          alt="banner"
          style={{ width: "100%", height: "350px", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "40px",
            color: "#fff",
            background: "rgba(0,0,0,0.5)",
            padding: "15px 25px",
            borderRadius: "10px",
          }}
        >
          <h1>{college.name}</h1>
          <p>📍 {college.location}</p>
        </div>
      </div>

      <div className="container mt-4">
        {/* 🏫 OVERVIEW */}
        <div className="card shadow p-4 mb-4">
          <h3>🏫 Overview</h3>
          <div className="row text-center mt-3">
            <div className="col-md-4">
              <h5>💰 Fees</h5>
              <p>₹{college.fees}</p>
            </div>
            <div className="col-md-4">
              <h5>🏆 Ranking</h5>
              <p>#{college.ranking}</p>
            </div>
            <div className="col-md-4">
              <h5>📍 Location</h5>
              <p>{college.location}</p>
            </div>
          </div>
        </div>

        {/* 📘 COURSES */}
        <div className="card shadow p-4 mb-4">
          <h3>📘 Courses Offered</h3>
          <ul>
            {college.courses.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* 💼 PLACEMENTS (Mock Data) */}
        <div className="card shadow p-4 mb-4">
          <h3>💼 Placements</h3>
          <p>
            <strong>Average Package:</strong> ₹8 LPA
          </p>
          <p>
            <strong>Highest Package:</strong> ₹25 LPA
          </p>
          <p>
            <strong>Top Recruiters:</strong> Google, Amazon, Microsoft
          </p>
        </div>

        {/* ⭐ REVIEWS */}
        <div className="card shadow p-4 mb-4">
          <h3>⭐ Student Reviews</h3>

          <div className="d-flex mb-3">
            <input
              className="form-control"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-success ms-2" onClick={addReview}>
              Submit
            </button>
          </div>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r, i) => (
              <div
                key={i}
                className="mb-3 p-3"
                style={{ background: "#f8f9fa", borderRadius: "10px" }}
              >
                <strong>{r.user}</strong>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CollegeDetails;
