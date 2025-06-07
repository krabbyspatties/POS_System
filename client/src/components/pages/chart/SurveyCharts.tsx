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

const surveyQuestions: {
  [question: string]: string[];
} = {
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
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#663399",
  "#33AA66",
  "#CC3333",
  "#3366CC",
  "#999966",
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
        setError("Failed to load chart data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading charts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Survey Results</h2>
      {summary &&
        Object.entries(summary).map(([question, answers]) => {
          const choices = surveyQuestions[question] || Object.keys(answers);

          // Prepare data for PieChart
          const data = choices.map((choice) => ({
            name: choice,
            value: answers[choice] || 0,
          }));

          return (
            <div key={question} style={{ marginBottom: 50 }}>
              <h4>{question}</h4>
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
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
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
  );
};

export default SurveyCharts;
