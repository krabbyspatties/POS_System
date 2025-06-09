import MainLayout from "../../layout/MainLayout";
import SurveyCharts from "../chart/SurveyCharts";
const FeedbackChartsPage = () => {
  const content = (
    <>
      <SurveyCharts />
      {/* <OpenEndedAnswers /> */}
    </>
  );
  return <MainLayout content={content} />;
};

export default FeedbackChartsPage;
