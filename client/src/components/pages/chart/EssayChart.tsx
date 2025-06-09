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

  if (loading) return <p>Loading possible improvements...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Suggestions & Possible Improvements</h3>
      <ul>
        {answers.map((answer, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenEndedAnswers;
