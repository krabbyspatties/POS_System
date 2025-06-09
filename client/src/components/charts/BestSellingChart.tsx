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
import { useEffect, useState } from "react";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define item type
type BestSellingItem = {
  item_name: string;
  total_sold: number;
};

const BestSellingChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    ChartService.loadChart()
      .then((response) => {
        const items: BestSellingItem[] = response.data;

        const labels = items.map((item: BestSellingItem) => item.item_name);
        const data = items.map((item: BestSellingItem) => item.total_sold);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Sold",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error loading chart data:", error);
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
        text: "Best-Selling Items",
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
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ width: 1000, margin: "40px 0 0 0", padding: 32, background: "#fff", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, letterSpacing: 0.3 }}></h2>
        {chartData ? (
          <div style={{ minHeight: 500 }}>
            <Bar data={chartData} options={options} />
          </div>
        ) : (
          <p style={{ color: "#888", fontStyle: "italic" }}>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default BestSellingChart;
