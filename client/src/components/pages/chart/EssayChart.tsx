import React, { useEffect, useState } from "react";
import feedbackServices from "../../../services/feedback";

const OpenEndedAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    feedbackServices
      .loadFeedback()
      .then((values: string[][]) => {
        if (!values || values.length === 0) {
          setError("No response data found");
          setLoading(false);
          return;
        }

        const headers = values[0];
        const rows = values.slice(1);

        const questionText =
          "In your opinion, What possible improvements can be implemented in the system?";

        const questionIndex = headers.findIndex((h) => h === questionText);

        if (questionIndex === -1) {
          setError("Open-ended question not found in responses");
          setLoading(false);
          return;
        }

        const filteredAnswers = rows
          .map((row) => row[questionIndex])
          .filter((answer) => answer && answer.trim() !== "");

        setAnswers(filteredAnswers);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load responses");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        marginTop: "70px",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h4 className="mb-4 text-dark fw-semibold">
          📝 Suggestions & Possible Improvements
        </h4>

        {loading && <p className="text-muted">Loading suggestions...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <ul style={{ paddingLeft: 0, listStyle: "none" }}>
            {answers.map((answer, idx) => (
              <li
                key={idx}
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {answer}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OpenEndedAnswers;
