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
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          No receipt data found. Please complete an order first.
        </div>
        <div className="text-center">
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(-1)}
          >
            &larr; Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Order Receipt</h4>
              <Receipt
                order_item={state.order_item}
                order_email={state.order_email}
                first_name={state.first_name}
                last_name={state.last_name}
              />
              <div className="text-end mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  &larr; Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
