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
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Top 10 Best-Selling Items</h2>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default BestSellingChart;
