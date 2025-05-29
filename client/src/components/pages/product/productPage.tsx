import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import AddOrderForm from "../../forms/orders/AddOrderForm";
import ProductsTable from "./product";
import AlertMessage from "../../AlertMessage";
import type { Items } from "../../../interfaces/Item/Items";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

const ProductPage = () => {
  const [refreshItems, setRefreshOrder] = useState(false);
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [itemList] = useState<Items[]>([]);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleAddToOrder = (item: Items) => {
    setOrderList((prev) => {
      const existing = prev.find((order) => order.item_id === item.item_id);
      if (existing) {
        if (existing.quantity >= item.item_quantity) {
          alert(
            `Not enough stock for ${item.item_name}. Only ${item.item_quantity} in stock.`
          );
          return prev;
        }
        return prev.map((order) =>
          order.item_id === item.item_id
            ? { ...order, quantity: order.quantity + 1 }
            : order
        );
      }

      if (item.item_quantity < 1) {
        alert(`No stock available for ${item.item_name}.`);
        return prev;
      }

      return [
        ...prev,
        {
          customer_email: "",
          item_id: item.item_id,
          quantity: 1,
          price: item.item_price,
          item,
        },
      ];
    });
  };

  const handleRemoveFromOrder = (item: Items) => {
    setOrderList((prev) =>
      prev
        .map((order) =>
          order.item_id === item.item_id
            ? { ...order, quantity: order.quantity - 1 }
            : order
        )
        .filter((order) => order.quantity > 0)
    );
  };

  const handleShowAlertMessage = (
    message: string,
    isSuccess: boolean,
    isVisible: boolean
  ) => {
    setMessage(message);
    setIsSuccess(isSuccess);
    setIsVisible(isVisible);
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };

  const content = (
    <>
      <AlertMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={isVisible}
        onClose={handleCloseAlertMessage}
      />
      <div className="container py-3">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <ProductsTable
              refreshItems={refreshItems}
              orderList={orderList}
              onAdd={handleAddToOrder}
              onRemove={handleRemoveFromOrder}
            />
          </div>

          <div className="col-lg-4">
            <AddOrderForm
              orderList={orderList}
              itemList={itemList}
              onOrderAdded={(msg) => {
                handleShowAlertMessage(msg, true, true);
                setRefreshOrder(!refreshItems);
                setOrderList([]);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  return <MainLayout content={content} />;
};

export default ProductPage;
