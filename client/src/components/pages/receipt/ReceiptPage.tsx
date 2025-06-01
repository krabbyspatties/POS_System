import { useLocation, useNavigate } from "react-router-dom";
import Receipt from "./receipt";

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const order_email = location.state?.order_email;

  if (!order) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="container py-3">
      <h2>Receipt</h2>
      <Receipt order={order} order_email={order_email} />
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ReceiptPage;
