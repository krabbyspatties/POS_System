import BestSellingChart from "../../charts/BestSellingChart";
import TopSpenderChart from "../../charts/TopSpender";
import MainLayout from "../../layout/MainLayout";

const ChartPage = () => {
  const content = (
    <>
      <h2>Chart</h2>
      <div style={{ display: "flex", gap: "2rem" }}>
      <BestSellingChart />
      <TopSpenderChart />
      </div>
    </>
  );
  return <MainLayout content={content} />;
};

export default ChartPage;
