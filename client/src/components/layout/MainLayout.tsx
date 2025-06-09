import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}

const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />


        {/* Main content adjusted to align with sidebar and navbar */}
        <main
          className="container-fluid"
          style={{
            paddingTop: "120px",
            paddingBottom: "40px",
            paddingLeft: "20px",
            paddingRight: "20px",
            flex: 1,
          }}
        >
          {content}
        </main>
      </div>
  );
};

export default MainLayout;
