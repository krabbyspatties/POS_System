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
  "The POS system is easy to use and user-friendly.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "The system responds quickly without significant delays.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "It is easy to train new staff to use the POS system.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "The POS system helps improve our transaction accuracy.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "I am satisfied with the reliability and stability of the system.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "The features of the POS system meet the needs of our business.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "The system integrates well with our inventory and reporting tools.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "Customer transactions are processed efficiently using the POS.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "Technical support is responsive and helpful when issues arise.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "I would recommend this POS system to other businesses.": [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  "What suggestions do you have for improving the POS system to better serve your needs?":
    [],
};

// Map each choice to a fixed color
const choiceColorMap: { [choice: string]: string } = {
  "Strongly Disagree": "#FF3333", // Red
  Disagree: "#FF8042", // Orange
  Neutral: "#FFBB28", // Yellow
  Agree: "#00C49F", // Teal
  "Strongly Agree": "#0088FE", // Blue
};

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
        setError("Failed to load chart data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2 className="mb-4">Survey Results</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gap: "24px",
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
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                }}
              >
                <h4 style={{ marginBottom: "16px" }}>{question}</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={choiceColorMap[entry.name] || "#8884d8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, "Count"]} />
                    <Legend />
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
