import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartService from "../../services/ChartService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TopCustomer = {
  customer_email: string;
  total_spent: number;
};

const TopSpenderChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    ChartService.loadTopSpenders()
      .then((response) => {
        const customers: TopCustomer[] = response.data;

        const labels = customers.map((cust) => cust.customer_email);
        const data = customers.map((cust) => cust.total_spent);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Spent (₱)",
              data,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error loading top spender data:", error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top 10 Spending Customers",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: 1000, margin: "40px 0 0 0", padding: 32, background: "#fff", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, letterSpacing: 0.3 }}></h2>
      {chartData ? (
        <div style={{ minHeight: 500 }}>
        <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>No Customer Yet</p>
      )}
      </div>
    </div>
  );
};

export default TopSpenderChart;
