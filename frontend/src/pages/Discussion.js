import { useEffect, useState } from "react";
import axios from "axios";

function Discussion() {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState("");
  const [answer, setAnswer] = useState({});

  const fetchQuestions = async () => {
    const res = await axios.get("http://localhost:5000/api/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Add question
  const addQuestion = async () => {
    if (!newQ) return alert("Enter question");
    await axios.post("http://localhost:5000/api/questions", {
      question: newQ,
    });
    setNewQ("");
    fetchQuestions();
  };

  // Add answer
  const addAnswer = async (id) => {
    if (!answer[id]) return alert("Enter answer");

    await axios.post(`http://localhost:5000/api/questions/answer/${id}`, {
      answer: answer[id],
    });

    setAnswer({ ...answer, [id]: "" });
    fetchQuestions();
  };

  return (
    <div className="container mt-4">
      <h2>💬 Discussion Forum</h2>

      {/* Ask Question */}
      <div className="card p-3 mb-4 shadow">
        <input
          className="form-control mb-2"
          placeholder="Ask a question..."
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addQuestion}>
          Ask
        </button>
      </div>

      {/* Questions List */}
      {questions.map((q) => (
        <div key={q._id} className="card p-3 mb-3 shadow-sm">
          <h5>{q.question}</h5>

          {/* Answers */}
          {q.answers.map((a, i) => (
            <p key={i} style={{ marginLeft: "20px" }}>
              ➤ {a}
            </p>
          ))}

          {/* Add Answer */}
          <div className="d-flex mt-2">
            <input
              className="form-control"
              placeholder="Write answer..."
              value={answer[q._id] || ""}
              onChange={(e) =>
                setAnswer({ ...answer, [q._id]: e.target.value })
              }
            />
            <button
              className="btn btn-success ms-2"
              onClick={() => addAnswer(q._id)}
            >
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Discussion;
