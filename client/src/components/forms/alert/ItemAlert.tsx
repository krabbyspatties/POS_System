import type { Items } from "../../../interfaces/Item/Items";
import SpinnerSmall from "../../SpinnerSmall";

interface ItemAlertProps {
  lowStockItems: Items[];
  loading: boolean;
}

const ItemAlert = ({ lowStockItems, loading }: ItemAlertProps) => {
  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <SpinnerSmall />
      </div>
    );
  }

  if (lowStockItems.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#d4edda",
          borderRadius: 12,
          border: "1px solid #c3e6cb",
          color: "#155724",
          padding: "16px 24px",
          boxShadow: "0 2px 6px rgba(21, 87, 36, 0.15)",
          fontWeight: "600",
          fontSize: "1rem",
        }}
      >
        ✅ All items have sufficient stock.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f8d7da",
        borderRadius: 12,
        border: "1px solid #f5c6cb",
        color: "#721c24",
        padding: 24,
        boxShadow: "0 2px 8px rgba(114, 28, 36, 0.2)",
        fontWeight: "600",
        fontSize: "1rem",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        ⚠️ <strong>Warning:</strong> The following items are running low on stock:
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontWeight: "normal",
          fontSize: "0.95rem",
          listStyleType: "disc",
          color: "#721c24",
        }}
      >
        {lowStockItems.map((item) => (
          <li key={item.item_id} style={{ marginBottom: 6 }}>
            {item.item_name} - Only <strong>{item.item_quantity}</strong> left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemAlert;
