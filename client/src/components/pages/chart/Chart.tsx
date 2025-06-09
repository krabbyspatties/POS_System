import BestSellingChart from "../../charts/BestSellingChart";
import TopSpenderChart from "../../charts/TopSpender";
import MainLayout from "../../layout/MainLayout";

const ChartPage = () => {
  const content = (
    <div
      className="container-fluid"
      style={{
        marginTop: "70px",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h3 className="mb-4 fw-semibold text-dark">📊 Analytics Dashboard</h3>

      <div
        className="row g-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem",
        }}
      >
        <div
          className="bg-white shadow-sm rounded p-4"
          style={{
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h5 className="mb-3 text-primary fw-bold">🔥 Best Selling Items</h5>
          <BestSellingChart />
        </div>

        <div
          className="bg-white shadow-sm rounded p-4"
          style={{
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h5 className="mb-3 text-success fw-bold">💰 Top Customers</h5>
          <TopSpenderChart />
        </div>
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default ChartPage;
