import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const TAGS = [
  "All",
  "Admissions",
  "Placements",
  "Cutoffs",
  "Fees",
  "Scholarships",
  "Hostel",
  "Comparisons",
];

function Discussion() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [search, setSearch] = useState("");

  // Ask Question State
  const [newQuestion, setNewQuestion] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newTag, setNewTag] = useState("Admissions");
  const [showAskForm, setShowAskForm] = useState(false);

  // Answer Input State per question
  const [answerInput, setAnswerInput] = useState({});

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedTag !== "All") params.tag = selectedTag;
      if (search) params.search = search;

      const res = await API.get("/questions", { params });
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, search]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to ask a question!");
      navigate("/login");
      return;
    }
    if (!newQuestion) {
      alert("Please enter a question title");
      return;
    }

    try {
      const res = await API.post("/questions", {
        question: newQuestion,
        details: newDetails,
        tags: [newTag],
      });

      if (res.data.success) {
        setNewQuestion("");
        setNewDetails("");
        setShowAskForm(false);
        fetchQuestions();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post question");
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!user) {
      alert("Please log in to post an answer!");
      navigate("/login");
      return;
    }
    const answerText = answerInput[questionId];
    if (!answerText || !answerText.trim()) {
      alert("Please write your answer");
      return;
    }

    try {
      const res = await API.post(`/questions/answer/${questionId}`, {
        answer: answerText,
      });
      if (res.data.success) {
        setAnswerInput({ ...answerInput, [questionId]: "" });
        fetchQuestions();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post answer");
    }
  };

  const handleUpvote = async (questionId) => {
    if (!user) {
      alert("Please log in to upvote questions!");
      navigate("/login");
      return;
    }
    try {
      await API.post(`/questions/${questionId}/upvote`);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }} className="pb-5">
      {/* 🔷 HEADER */}
      <div
        className="text-white py-4 px-3 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)",
        }}
      >
        <div className="container py-2 text-center text-dark">
          <h1 className="fw-bold mb-2">💬 Student Discussion & Q&A Forum</h1>
          <p className="lead mb-0 mx-auto" style={{ maxWidth: "650px" }}>
            Ask questions, connect with alumni and current students, and get clear guidance on cutoffs, hostel life, and college choices.
          </p>
        </div>
      </div>

      <div className="container">
        {/* ACTION BAR: SEARCH, ASK BUTTON, TAG PILLS */}
        <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div className="input-group" style={{ maxWidth: "450px" }}>
              <span className="input-group-text bg-white">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search forum questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary fw-bold"
              onClick={() => setShowAskForm(!showAskForm)}
            >
              {showAskForm ? "✕ Cancel" : "✍️ Ask a Question"}
            </button>
          </div>

          {/* Tag Filter Pills */}
          <div className="d-flex gap-2 flex-wrap">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={`btn btn-sm rounded-pill ${
                  selectedTag === tag
                    ? "btn-dark fw-bold"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ASK QUESTION FORM ACCORDION */}
        {showAskForm && (
          <div className="card border-0 shadow-sm p-4 mb-4 rounded-3 border-start border-4 border-primary">
            <h5 className="fw-bold mb-3">✍️ Ask the Community</h5>
            <form onSubmit={handleAskQuestion}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Question Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Which NIT is best for CSE placements among Trichy, Surathkal, and Warangal?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Topic Category</label>
                  <select
                    className="form-select"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  >
                    {TAGS.filter((t) => t !== "All").map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label small fw-semibold">Additional Details (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Include rank, background, or specific doubts..."
                    value={newDetails}
                    onChange={(e) => setNewDetails(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success fw-semibold">
                Publish Question 🚀
              </button>
            </form>
          </div>
        )}

        {/* QUESTIONS LIST */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading forum discussions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-3">
            <h4>No questions found in this category</h4>
            <p className="text-muted">Be the first student to start a discussion!</p>
            <button
              className="btn btn-primary btn-sm mx-auto"
              onClick={() => setShowAskForm(true)}
            >
              Ask First Question
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {questions.map((q) => {
              const hasUpvoted =
                user && (q.upvotes || []).some((id) => id === user._id || id._id === user._id);

              return (
                <div key={q._id} className="card border-0 shadow-sm p-4 rounded-3">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        🏷️ {(q.tags || ["Admissions"])[0]}
                      </span>
                      {q.collegeName && (
                        <span className="badge bg-secondary-subtle text-dark">
                          🏛️ {q.collegeName}
                        </span>
                      )}
                    </div>
                    <small className="text-muted">
                      Asked by <strong>{q.authorName || "Student"}</strong> •{" "}
                      {new Date(q.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{q.question}</h5>
                  {q.details && <p className="text-secondary mb-3">{q.details}</p>}

                  {/* Upvote & Answers Bar */}
                  <div className="d-flex align-items-center gap-3 mb-3 pt-2 border-top">
                    <button
                      className={`btn btn-sm ${
                        hasUpvoted ? "btn-primary" : "btn-outline-primary"
                      } d-flex align-items-center gap-1`}
                      onClick={() => handleUpvote(q._id)}
                    >
                      <span>▲</span>
                      <span>Upvote</span>
                      <span className="badge bg-light text-dark ms-1">
                        {(q.upvotes || []).length}
                      </span>
                    </button>

                    <span className="text-muted small">
                      💬 {(q.answers || []).length} Answers
                    </span>
                  </div>

                  {/* Nested Answers */}
                  <div className="bg-light p-3 rounded-3 mb-3">
                    <h6 className="fw-semibold text-secondary mb-3 small">
                      COMMUNITY ANSWERS ({(q.answers || []).length})
                    </h6>

                    {q.answers && q.answers.length > 0 ? (
                      <div className="d-flex flex-column gap-2 mb-3">
                        {q.answers.map((ans, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded border border-light-subtle shadow-sm"
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong className="text-dark small">
                                👤 {ans.authorName || "Student"}
                              </strong>
                              <small className="text-muted" style={{ fontSize: "11px" }}>
                                {new Date(ans.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <p className="mb-0 text-secondary small">{ans.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-3">
                        No answers yet. Share your experience below!
                      </p>
                    )}

                    {/* Answer Input */}
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a helpful answer..."
                        value={answerInput[q._id] || ""}
                        onChange={(e) =>
                          setAnswerInput({
                            ...answerInput,
                            [q._id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddAnswer(q._id);
                        }}
                      />
                      <button
                        className="btn btn-success fw-semibold"
                        onClick={() => handleAddAnswer(q._id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussion;
