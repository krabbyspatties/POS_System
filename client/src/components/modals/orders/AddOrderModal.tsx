import { useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import type { OrderFieldErrors } from "../../../interfaces/order/orderFieldError";
import OrderServices from "../../../services/OrderService";
import ErrorHandler from "../../handler/ErrorHandler";
import SpinnerSmall from "../../SpinnerSmall";
import AlertMessage from "../../AlertMessage";

interface OrderInfo {
  customer_email: string;
  first_name: string;
  last_name: string;
}

interface AddOrderModalProps {
  showModal: boolean;
  onClose: () => void;
  onOrderAdded: (message: string, order: OrderInfo) => void;
  orderList: OrderItem[];
  onAdd: (item: Items) => void;
  itemList: Items[];
  onRemove: (item: Items) => void;
}

const AddOrderModal = ({
  showModal,
  onClose,
  onOrderAdded,
  orderList,
  onAdd,
  onRemove,
}: AddOrderModalProps) => {
  const [state, setState] = useState({
    loadingStore: false,
    customer_email: "",
    first_name: "",
    last_name: "",
    errors: {} as OrderFieldErrors,
  });

  const getDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  const totalPrice = orderList.reduce((total, order) => {
    const discountedPrice = getDiscountedPrice(order.price, order.item.item_discount ?? 0);
    return total + discountedPrice * order.quantity;
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (orderList.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const outOfStock = orderList.filter(order => order.quantity > order.item.item_quantity);
    if (outOfStock.length) {
      alert("Insufficient stock for: " + outOfStock.map(o => o.item.item_name).join(", "));
      return;
    }

    const formData = {
      customer_email: state.customer_email,
      first_name: state.first_name,
      last_name: state.last_name,
      items: orderList.map(order => ({
        item_id: order.item_id,
        quantity: order.quantity,
        price: getDiscountedPrice(order.price, order.item.item_discount ?? 0),
        item_discount: order.item.item_discount ?? 0,
      })),
    };

    setState((prev) => ({ ...prev, loadingStore: true }));

    OrderServices.createOrders(formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setState({
            loadingStore: false,
            customer_email: "",
            first_name: "",
            last_name: "",
            errors: {},
          });
          onOrderAdded(res.data.message, {
            customer_email: state.customer_email,
            first_name: state.first_name,
            last_name: state.last_name,
          });
          onClose();
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setState((prev) => ({ ...prev, errors: error.response.data.errors }));
        }
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loadingStore: false }));
      });
  };

  return (
    <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form onSubmit={handleStoreOrder}>
            <div className="modal-header">
              <h5 className="modal-title">Add Order</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Customer Email</label>
                <input
                  type="email"
                  className={`form-control ${state.errors.customer_email ? "is-invalid" : ""}`}
                  name="customer_email"
                  value={state.customer_email}
                  onChange={handleInputChange}
                />
                {state.errors.customer_email && <div className="text-danger">{state.errors.customer_email[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">First Name</label>
                <input
                  type="text"
                  className={`form-control ${state.errors.first_name ? "is-invalid" : ""}`}
                  name="first_name"
                  value={state.first_name}
                  onChange={handleInputChange}
                />
                {state.errors.first_name && <div className="text-danger">{state.errors.first_name[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Last Name</label>
                <input
                  type="text"
                  className={`form-control ${state.errors.last_name ? "is-invalid" : ""}`}
                  name="last_name"
                  value={state.last_name}
                  onChange={handleInputChange}
                />
                {state.errors.last_name && <div className="text-danger">{state.errors.last_name[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Order Items</label>
                {orderList.length === 0 ? (
                  <p className="text-muted">No items added yet.</p>
                ) : (
                  <ul className="list-group">
                    {orderList.map((order) => {
                      const discounted = getDiscountedPrice(order.price, order.item.item_discount ?? 0);
                      return (
                        <li
                          key={order.item_id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {order.item.item_name} × {order.quantity}
                            <br />
                            <small>₱{discounted.toFixed(2)} / {order.item.item_discount}% off</small>
                          </span>
                          <div>
                            <button type="button" className="btn btn-sm btn-outline-danger me-1" onClick={() => onRemove(order.item)}>-</button>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onAdd(order.item)}>+</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {orderList.length > 0 && (
                <div className="mt-3 fw-bold">
                  Total Price: ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={state.loadingStore}>
                Close
              </button>
              <button type="submit" className="btn btn-primary" disabled={state.loadingStore}>
                {state.loadingStore ? <><SpinnerSmall /> Saving...</> : "Submit Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;
