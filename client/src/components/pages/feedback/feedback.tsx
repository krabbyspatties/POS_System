import MainLayout from "../../layout/MainLayout";
import OpenEndedAnswers from "../chart/EssayChart";
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
