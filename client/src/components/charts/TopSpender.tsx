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
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Top Spending Customers</h2>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No Customer Yet</p>
      )}
    </div>
  );
};

export default TopSpenderChart;
