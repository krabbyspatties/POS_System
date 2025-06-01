import React from "react";
import type { Items } from "../../../interfaces/Item/Items";
import SpinnerSmall from "../../SpinnerSmall";

interface ItemAlertProps {
  lowStockItems: Items[];
  loading: boolean;
}

const ItemAlert = ({ lowStockItems, loading }: ItemAlertProps) => {
  if (loading) {
    return <SpinnerSmall />;
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="alert alert-success" role="alert">
        All items have sufficient stock.
      </div>
    );
  }

  return (
    <div className="alert alert-danger" role="alert">
      <strong>Warning:</strong> The following items are running low on stock:
      <ul>
        {lowStockItems.map((item) => (
          <li key={item.item_id}>
            {item.item_name} - Only {item.item_quantity} left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemAlert;
