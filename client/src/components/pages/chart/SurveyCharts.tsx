import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import feedbackServices from "../../../services/feedback";

interface SummaryData {
  [question: string]: {
    [choice: string]: number;
  };
}

const surveyQuestions: { [question: string]: string[] } = {
  // (same questions as your original)
  "How easy was it to complete your transaction using our POS system?": [
    "Very Easy",
    "Easy",
    "Neutral",
    "Difficult",
    "Very Difficult",
  ],
  // ... (include the rest unchanged)
};

const COLORS = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];

const SurveyCharts: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    feedbackServices
      .loadSummary()
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Failed to load chart data");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        marginTop: "70px",
      }}
    >
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "2rem",
          color: "#333",
        }}
      >
        📊 Customer Feedback Charts
      </h2>

      {loading && <p className="text-muted">Loading charts...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gap: "2rem",
        }}
      >
        {summary &&
          Object.entries(summary).map(([question, answers]) => {
            const choices = surveyQuestions[question] || Object.keys(answers);
            const data = choices.map((choice) => ({
              name: choice,
              value: answers[choice] || 0,
            }));

            return (
              <div
                key={question}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "1.5rem",
                  transition: "0.2s",
                }}
              >
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    color: "#222",
                  }}
                >
                  {question}
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}`, "Count"]} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: "0.85rem" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SurveyCharts;
