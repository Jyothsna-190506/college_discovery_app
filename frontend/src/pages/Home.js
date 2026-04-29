import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const addFavorite = async (id, e) => {
    e.stopPropagation();
    await axios.post("http://localhost:5000/api/users/favorite", {
      userId: user._id,
      collegeId: id,
      colleges: selected.map((c) => c._id),
    });
    alert("Added to favorites!");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/colleges")
      .then((res) => setColleges(res.data));
  }, []);

  const handleSelect = (college, checked) => {
    if (checked) {
      if (selected.length >= 3) {
        alert("You can compare max 3 colleges");
        return;
      }
      setSelected([...selected, college]);
    } else {
      setSelected(selected.filter((c) => c._id !== college._id));
    }
  };

  const filtered = colleges.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());

    let matchFilter = true;
    if (filter === "low") matchFilter = c.fees < 200000;
    if (filter === "high") matchFilter = c.fees >= 200000;

    return matchSearch && matchFilter;
  });

  return (
    <div className="container mt-4">
      {/* 🔷 HERO */}
      <div className="bg-light p-5 rounded text-center mb-4 shadow-sm">
        <h1 className="fw-bold">🎓 Find Your Dream College</h1>
        <p className="text-muted">Compare, Explore and Choose the Best</p>
        {/* 🔥 ADD HERE */}
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/predictor")}
        >
          🧠 Try College Predictor
        </button>
        <button
          className="btn btn-dark mt-3 ms-2"
          onClick={() => navigate("/discussion")}
        >
          💬 Discussion Forum
        </button>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Fees &lt; 2L</option>
            <option value="high">Fees &gt; 2L</option>
          </select>
        </div>
      </div>

      {/* 🔥 COMPARE BUTTON */}
      <div className="mb-3 text-end">
        <button
          className="btn btn-primary"
          disabled={selected.length < 2}
          onClick={() => navigate("/compare", { state: selected })}
        >
          Compare ({selected.length})
        </button>
      </div>

      {/* 🧱 CARDS */}
      <div className="row">
        {filtered.length === 0 ? (
          <p>No colleges found</p>
        ) : (
          filtered.map((c) => (
            <div className="col-md-4 mb-4" key={c._id}>
              <div
                className="card shadow-sm h-100"
                onClick={() => navigate(`/college/${c._id}`)}
                style={{ cursor: "pointer" }}
              >
                {/* 🖼️ IMAGE */}
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      c.image ||
                      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800"
                    }
                    alt="college"
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <h5
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "#fff",
                      background: "rgba(0,0,0,0.5)",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    {c.name}
                  </h5>
                </div>

                {/* 📄 BODY */}
                <div className="card-body">
                  <p className="text-muted">📍 {c.location}</p>
                  <p>💰 ₹{c.fees}</p>
                  <p>🏆 Rank: {c.ranking}</p>

                  {/* ✅ SELECT FOR COMPARE */}
                  <div>
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleSelect(c, e.target.checked)}
                    />{" "}
                    Compare
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={(e) => addFavorite(c._id, e)}
                  >
                    ❤️ Favorite
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
