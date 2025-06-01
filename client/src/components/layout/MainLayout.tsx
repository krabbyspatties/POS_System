import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}

const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Navbar />
      </div>
      <main>
        {content}
      </main>
    </div>
  );
};

export default MainLayout;
