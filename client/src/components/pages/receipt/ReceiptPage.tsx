import { useLocation, useNavigate } from "react-router-dom";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import Receipt from "./receipt";

interface ReceiptState {
  order_item: OrderItem[];
  order_email: string;
  first_name: string;
  last_name: string;
}

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReceiptState | undefined;

  if (!state || !state.order_item) {
    return <p>No receipt data found. Please complete an order first.</p>;
  }

  return (
    <div>
      <Receipt
        order_item={state.order_item}
        order_email={state.order_email}
        first_name={state.first_name}
        last_name={state.last_name}
      />
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </div>
  );
};

export default ReceiptPage;
