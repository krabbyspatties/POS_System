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
  "How easy was it to complete your transaction using our POS system?": [
    "Very Easy",
    "Easy",
    "Neutral",
    "Difficult",
    "Very Difficult",
  ],
  "How easy was it to navigate the POS screen or menu?": [
    "Very Easy",
    "Easy",
    "Neutral",
    "Difficult",
    "Very Difficult",
  ],
  "How satisfied were you with the speed of the checkout?": [
    "Very Satisfied",
    "Satisfied",
    "Neutral",
    "Dissatisfied",
    "Very Dissatisfied",
  ],
  "How smooth was the payment process?": [
    "Excellent",
    "Good",
    "Neutral",
    "Poor",
    "Very Poor",
  ],
  "How well did the POS system support your preferred payment method?": [
    "Completely",
    "Mostly",
    "Moderately",
    "Slightly",
    "Not at all",
  ],
  "Did you experience any technical issues during the transaction?": [
    "Perfect experience",
    "No issues",
    "A few minor issues",
    "Some issues",
    "Many issues",
  ],
  "How clear and understandable was the on-screen information?": [
    "Very clear",
    "Clear",
    "Neutral",
    "Unclear",
    "Very unclear",
  ],
  "How confident were you in reviewing your order details before payment?": [
    "Completely confident",
    "Very confident",
    "Moderately confident",
    "Slightly confident",
    "Not confident at all",
  ],
  "How accurately did the POS system display your total amount?": [
    "Very accurate",
    "Accurate",
    "Neutral",
    "Inaccurate",
    "Very inaccurate",
  ],
  "How satisfied were you with the promptness and accuracy of your receipt?": [
    "Very Satisfied",
    "Satisfied",
    "Neutral",
    "Dissatisfied",
    "Very Dissatisfied",
  ],
  "How helpful was the customer-facing screen during checkout?": [
    "Extremely helpful",
    "Very helpful",
    "Moderately helpful",
    "Slightly helpful",
    "Not helpful at all",
  ],
  "In your opinion, What possible improvements can be implemented in the system?":
    [],
};

// Map each choice to a fixed color
const choiceColorMap: { [choice: string]: string } = {
  "Very Easy": "#0088FE",
  Easy: "#00C49F",
  Neutral: "#FFBB28",
  Difficult: "#FF8042",
  "Very Difficult": "#FF3333",

  "Very Satisfied": "#0088FE",
  Satisfied: "#00C49F",
  Dissatisfied: "#FF8042",
  "Very Dissatisfied": "#FF3333",

  Excellent: "#0088FE",
  Good: "#00C49F",
  Poor: "#FF8042",
  "Very Poor": "#FF3333",

  Completely: "#0088FE",
  Mostly: "#00C49F",
  Moderately: "#FFBB28",
  Slightly: "#FF8042",
  "Not at all": "#FF3333",

  "Perfect experience": "#0088FE",
  "No issues": "#00C49F",
  "A few minor issues": "#FFBB28",
  "Some issues": "#FF8042",
  "Many issues": "#FF3333",

  "Very clear": "#0088FE",
  Clear: "#00C49F",
  Unclear: "#FF8042",
  "Very unclear": "#FF3333",

  "Completely confident": "#0088FE",
  "Very confident": "#00C49F",
  "Moderately confident": "#FFBB28",
  "Slightly confident": "#FF8042",
  "Not confident at all": "#FF3333",

  "Very accurate": "#0088FE",
  Accurate: "#00C49F",
  Inaccurate: "#FF8042",
  "Very inaccurate": "#FF3333",

  "Extremely helpful": "#0088FE",
  "Very helpful": "#00C49F",
  "Moderately helpful": "#FFBB28",
  "Slightly helpful": "#FF8042",
  "Not helpful at all": "#FF3333",
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      isAnimationActive={false}
                    >
                      {data.map((entry, index) => {
                        console.log("ENTRY NAME:", entry.name);
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={choiceColorMap[entry.name] || "#8884d8"}
                          />
                        );
                      })}
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
