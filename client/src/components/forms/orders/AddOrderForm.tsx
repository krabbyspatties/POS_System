import { useState, type ChangeEvent, type FormEvent } from "react";
import type { OrderFieldErrors } from "../../../interfaces/order/orderFieldError";
import OrderServices from "../../../services/OrderService";
import ErrorHandler from "../../handler/ErrorHandler";
import SpinnerSmall from "../../SpinnerSmall";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface AddOrdersFormProps {
  onOrderAdded: (message: string, order: { customer_email: string }) => void;
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
      items: orderList.map((order) => {
        const discountedPrice = getDiscountedPrice(
          order.price,
          order.item.item_discount ?? 0
        );
        return {
          item_id: order.item_id,
          quantity: order.quantity,
          price: discountedPrice,
        };
      }),
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

          onOrderAdded(res.data.message, {
            customer_email: state.customer_email,
          });
        } else {
          console.error(
            "Unexpected Status error during storing order: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
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
        <div className="">
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
        <div className="">
          <label htmlFor="first_name">First_name</label>
          <input
            type="email"
            className={`form-control ${
              state.errors.first_name ? "is-invalid" : ""
            }`}
            id="first_name"
            name="first_name"
            value={state.first_name}
            onChange={handleInputChange}
          />
          {state.errors.first_name && (
            <p className="text-danger">{state.errors.first_name[0]}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="email"
            className={`form-control ${
              state.errors.last_name ? "is-invalid" : ""
            }`}
            id="last_name"
            name="last_name"
            value={state.last_name}
            onChange={handleInputChange}
          />
          {state.errors.last_name && (
            <p className="text-danger">{state.errors.last_name[0]}</p>
          )}
        </div>

        <div className="mb-3">
          <label>Order List</label>
          {orderList.length === 0 ? (
            <p className="text-muted">No items in the order yet.</p>
          ) : (
            <ul className="list-group mb-2">
              {orderList.map((order) => {
                const discountedPrice = getDiscountedPrice(
                  order.price,
                  order.item.item_discount ?? 0
                );
                return (
                  <li
                    key={order.item_id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <strong className="me-2">{order.item.item_name}</strong>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => onRemove(order.item)}
                      >
                        -
                      </button>
                      <span className="mx-2">{order.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onAdd(order.item)}
                      >
                        +
                      </button>
                      <span className="ms-3">
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={state.loadingStore}
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
      </div>
    </form>
  );
};

export default AddOrderForm;
