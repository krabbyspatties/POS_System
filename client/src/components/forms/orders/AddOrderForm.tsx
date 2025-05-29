import { useState, type ChangeEvent, type FormEvent } from "react";
import type { OrderFieldErrors } from "../../../interfaces/order/orderFieldError";
import OrderServices from "../../../services/OrderService";
import ErrorHandler from "../../handler/ErrorHandler";
import SpinnerSmall from "../../SpinnerSmall";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface AddOrdersFormProps {
  onOrderAdded: (message: string) => void;
  orderList: OrderItem[];
  itemList: Items[];
}

const AddOrderForm = ({ onOrderAdded, orderList }: AddOrdersFormProps) => {
  const [state, setState] = useState({
    loadingStore: false,
    customer_email: "",
    errors: {} as OrderFieldErrors,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const totalPrice = orderList.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );
  const handleStoreOrder = (e: FormEvent) => {
    console.log("Total Price: ", totalPrice);
    e.preventDefault();

    if (orderList.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }

    const outOfStockItems = orderList.filter((order) => {
      const item = order.item;
      return order.quantity > item.item_quantity;
    });

    if (outOfStockItems.length > 0) {
      const message = outOfStockItems
        .map(
          (order) =>
            `${order.item.item_name} (ordered: ${order.quantity}, in stock: ${order.item.item_quantity})`
        )
        .join("\n");

      alert("Insufficient stock for the following items:\n" + message);
      return;
    }

    const formData = {
      customer_email: state.customer_email,
      items: orderList.map((order) => ({
        item_id: order.item_id,
        quantity: order.quantity,
        price: order.price,
      })),
    };

    setState((prevState) => ({
      ...prevState,
      loadingStore: true,
    }));

    OrderServices.createOrders(formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setState((prevState) => ({
            ...prevState,
            customer_email: "",
            errors: {} as OrderFieldErrors,
          }));
          onOrderAdded(res.data.message);
        } else {
          console.error(
            "Unexpected Status error during storing order: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        }
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStore: false,
        }));
      });
  };

  return (
    <form onSubmit={handleStoreOrder}>
      <div className="form-group">
        <div className="mb-3">
          <label htmlFor="customer_email">Customer Email</label>
          <input
            type="email"
            className={`form-control ${
              state.errors.customer_email ? "is-invalid" : ""
            }`}
            id="customer_email"
            name="customer_email"
            value={state.customer_email}
            onChange={handleInputChange}
          />
          {state.errors.customer_email && (
            <p className="text-danger">{state.errors.customer_email[0]}</p>
          )}
        </div>

        <div className="mb-3">
          <label>Order List</label>
          {orderList.length === 0 ? (
            <p className="text-muted">No items in the order yet.</p>
          ) : (
            <ul className="list-group mb-2">
              {orderList.map((order) => (
                <li
                  key={order.item_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {order.item.item_name}
                  <span className="">{order.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {orderList.length > 0 && (
          <div className="mb-3">
            <p className="fw-bold">
              Total Price: ₱
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        )}

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            {state.loadingStore ? (
              <>
                <SpinnerSmall /> Loading...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddOrderForm;
