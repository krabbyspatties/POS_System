import type { Order } from "../../../interfaces/order/order";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

const Receipt = ({
  order,
  order_email,
}: {
  order: OrderItem[];
  order_email: string;
}) => {
  const total = order.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  return (
    <div className="card mt-3">
      <div className="card-header">
        <strong>Receipt</strong>
      </div>
      <div className="p-3">
        <p>
          <strong>Ordered By:</strong> {order_email}
        </p>
      </div>
      <ul className="list-group list-group-flush">
        {order.map((item) => (
          <li
            key={item.item_id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>
              {item.item.item_name} x {item.quantity}
            </span>
            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <strong>Total:</strong>
          <strong>₱{total.toFixed(2)}</strong>
        </li>
      </ul>
    </div>
  );
};

export default Receipt;
