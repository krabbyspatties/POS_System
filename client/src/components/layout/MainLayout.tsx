import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}

const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>{content}</main>
    </div>
  );
};

export default MainLayout;
