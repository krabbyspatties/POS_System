import { useState, type ChangeEvent, type FormEvent } from "react";
import type { OrderFieldErrors } from "../../../interfaces/order/orderFieldError";
import OrderServices from "../../../services/OrderService";
import ErrorHandler from "../../handler/ErrorHandler";
import SpinnerSmall from "../../SpinnerSmall";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface OrderInfo {
  customer_email: string;
  first_name: string;
  last_name: string;
}
interface AddOrdersFormProps {
  onOrderAdded: (message: string, order: OrderInfo) => void;
  orderList: OrderItem[];
  onAdd: (item: Items) => void;
  itemList: Items[];
  onRemove: (item: Items) => void;
}

const AddOrderForm = ({
  onOrderAdded,
  orderList,
  onAdd,
  onRemove,
}: AddOrdersFormProps) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const totalPrice = orderList.reduce((total, order) => {
    const discountedPrice = getDiscountedPrice(
      order.price,
      order.item.item_discount ?? 0
    );
    return total + discountedPrice * order.quantity;
  }, 0);

  const handleStoreOrder = (e: FormEvent) => {
    e.preventDefault();

    if (orderList.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }
    const outOfStockItems = orderList.filter(
      (order) => order.quantity > order.item.item_quantity
    );
    if (outOfStockItems.length > 0) {
      alert(
        "Insufficient stock for the following items:\n" +
          outOfStockItems
            .map(
              (order) =>
                `${order.item.item_name} (ordered: ${order.quantity}, in stock: ${order.item.item_quantity})`
            )
            .join("\n")
      );
      return;
    }

    const formData = {
      customer_email: state.customer_email,
      first_name: state.first_name,
      last_name: state.last_name,
      items: orderList.map((order) => ({
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
            errors: {} as OrderFieldErrors,
          });
          onOrderAdded(res.data.message, {
            customer_email: state.customer_email,
            first_name: state.first_name,
            last_name: state.last_name,
          });
        } else {
          console.error("Unexpected status code: ", res.status);
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
    <div
      style={{
      position: "fixed",
      top: "80px", 
      right: 0,
      height: "calc(100vh - 80px)", 
      width: "400px",
      background: "#fff",
      boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
      zIndex: 1050,
      transition: "transform 0.3s ease-in-out",
      transform: "translateX(0)",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      }}
      className="pos-order-form"
    >
      <form onSubmit={handleStoreOrder} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="form-group" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: "16px" }}>
      <label htmlFor="customer_email" className="fw-bold">Customer Email</label>
      <input
        type="email"
        className={`form-control ${state.errors.customer_email ? "is-invalid" : ""}`}
        id="customer_email"
        name="customer_email"
        value={state.customer_email}
        onChange={handleInputChange}
        style={{ borderRadius: "8px", marginTop: "4px" }}
      />
      {state.errors.customer_email && (
        <p className="text-danger">{state.errors.customer_email[0]}</p>
      )}
      </div>
      <div style={{ marginBottom: "16px" }}>
      <label htmlFor="first_name" className="fw-bold">First Name</label>
      <input
        type="text"
        className={`form-control ${state.errors.first_name ? "is-invalid" : ""}`}
        id="first_name"
        name="first_name"
        value={state.first_name}
        onChange={handleInputChange}
        style={{ borderRadius: "8px", marginTop: "4px" }}
      />
      {state.errors.first_name && (
        <p className="text-danger">{state.errors.first_name[0]}</p>
      )}
      </div>

      <div className="mb-3" style={{ marginBottom: "16px" }}>
      <label htmlFor="last_name" className="fw-bold">Last Name</label>
      <input
        type="text"
        className={`form-control ${state.errors.last_name ? "is-invalid" : ""}`}
        id="last_name"
        name="last_name"
        value={state.last_name}
        onChange={handleInputChange}
        style={{ borderRadius: "8px", marginTop: "4px" }}
      />
      {state.errors.last_name && (
        <p className="text-danger">{state.errors.last_name[0]}</p>
      )}
      </div>

      <div className="mb-3" style={{ marginBottom: "16px" }}>
      <label className="fw-bold">Order List</label>
      {orderList.length === 0 ? (
        <p className="text-muted">No items in the order yet.</p>
      ) : (
        <ul className="list-group mb-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
        {orderList.map((order) => {
        const discountedPrice = getDiscountedPrice(
        order.price,
        order.item.item_discount ?? 0
        );
        return (
        <li
          key={order.item_id}
          className="list-group-item d-flex justify-content-between align-items-center"
          style={{
          border: "none",
          borderBottom: "1px solid #eee",
          padding: "10px 0",
          background: "transparent",
          }}
        >
          <div className="d-flex align-items-center">
          <strong className="me-2">{order.item.item_name}</strong>
          <button
          type="button"
          className="btn btn-sm btn-outline-danger me-2"
          onClick={() => onRemove(order.item)}
          style={{ borderRadius: "50%", width: "28px", height: "28px", padding: 0 }}
          >
          -
          </button>
          <span className="mx-2">{order.quantity}</span>
          <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onAdd(order.item)}
          style={{ borderRadius: "50%", width: "28px", height: "28px", padding: 0 }}
          >
          +
          </button>
          <span className="ms-3" style={{ fontSize: "0.95em", color: "#888" }}>
          ₱{discountedPrice.toFixed(2)} each{" "}
          {order.item.item_discount}% discount
          </span>
          </div>
        </li>
        );
        })}
        </ul>
      )}
      </div>

      {orderList.length > 0 && (
      <div className="mb-3" style={{ marginBottom: "16px" }}>
        <p className="fw-bold" style={{ fontSize: "1.2em" }}>
        Total Price: ₱
        {totalPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        })}
        </p>
      </div>
      )}
      </div>

      <div className="d-flex justify-content-end" style={{ marginTop: "auto" }}>
      <button
      type="submit"
      className="btn btn-primary"
      disabled={state.loadingStore}
      style={{
        width: "100%",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "1.1em",
        padding: "12px 0",
        letterSpacing: "1px",
      }}
      >
      {state.loadingStore ? (
        <>
        <SpinnerSmall /> Loading...
        </>
      ) : (
        "Submit Order"
      )}
      </button>
      </div>
      </form>
    </div>
  );
};

export default AddOrderForm;
