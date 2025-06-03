import BestSellingChart from "../../charts/BestSellingChart";
import TopSpenderChart from "../../charts/TopSpender";
import MainLayout from "../../layout/MainLayout";

const ChartPage = () => {
  const content = (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Sales Analytics</h1>
        <BestSellingChart />
        <TopSpenderChart />
      </div>
    </>
  );
  return <MainLayout content={content} />;
};

export default ChartPage;
