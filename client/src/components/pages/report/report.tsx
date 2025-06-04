import MainLayout from "../../layout/MainLayout";
import ReportsDashboard from "../../report/report";

const ReportPage = () => {
  const content = (
    <>
      <div>
        <ReportsDashboard />
      </div>
    </>
  );
  return <MainLayout content={content} />;
};

export default ReportPage;
