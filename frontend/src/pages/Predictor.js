import { useState } from "react";

function Predictor() {
  const [exam, setExam] = useState("JEE");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState([]);

  const predict = () => {
    let colleges = [];

    if (!rank) return alert("Enter rank!");

    const r = parseInt(rank);

    if (r <= 1000) {
      colleges = ["IIT Bombay", "IIT Delhi", "IIT Madras"];
    } else if (r <= 5000) {
      colleges = ["IIIT Hyderabad", "NIT Trichy"];
    } else if (r <= 15000) {
      colleges = ["NIT Warangal", "VIT Vellore"];
    } else {
      colleges = ["Amity University", "Local Engineering Colleges"];
    }

    setResults(colleges);
  };

  return (
    <div className="container mt-4">
      <h2>🧠 College Predictor Tool</h2>

      {/* Input */}
      <div className="card p-4 shadow mb-4">
        <label>Exam</label>
        <select
          className="form-select mb-3"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
        >
          <option>JEE</option>
        </select>

        <label>Your Rank</label>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter your rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />

        <button className="btn btn-primary" onClick={predict}>
          Predict Colleges
        </button>
      </div>

      {/* Output */}
      <div className="card p-4 shadow">
        <h4>🎯 Suggested Colleges</h4>

        {results.length === 0 ? (
          <p>No results yet</p>
        ) : (
          <ul>
            {results.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Predictor;
