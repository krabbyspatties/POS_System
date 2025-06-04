import type { Items } from "../../../interfaces/Item/Items";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner";
import AddItemModal from "../../modals/item/AddItemModal";
import { useState } from "react";

interface ItemsTableProps {
  items: Items[];
  loadingItems: boolean;
  onEditItem: (item: Items) => void;
  onDeleteItem: (item: Items) => void;
}

const ItemsTable = ({
  items,
  loadingItems,
  onEditItem,
  onDeleteItem,
}: ItemsTableProps) => {
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);
  return (

      <div style={{ flex: 1, padding: 32 }}>
      <div
        style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 16,
        }}
      >
        <button
        className="btn btn-primary btn-sm"
        style={{ marginRight: 8 }}
        onClick={() => setOpenAddItemModal(true)}
        >
        Add Item
        </button>
      </div>
      <div
        style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #e0e0e0",
        }}
      >
        <table className="table table-hover mb-0" style={{ width: "100%" }}>
        <thead className="table-light">
          <tr>
          <th>No.</th>
          <th>Image</th>
          <th>Item</th>
          <th>Description</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Stocks</th>
          <th>Status</th>
          <th>Category</th>
          <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingItems ? (
          <tr>
            <td colSpan={10} className="text-center">
            <Spinner />
            </td>
          </tr>
          ) : items.length > 0 ? (
          items.map((item, index) => (
            <tr className="align-middle" key={item.item_id}>
            <td>{index + 1}</td>
            <td>
              {item.item_image ? (
              <Link to={`/items/${item.item_id}`}>
                <img
                src={`http://localhost:8000/storage/${
                  item.item_image || "Images/placeholder.png"
                }`}
                alt={item.item_name}
                className="rounded-circle img-thumbnail"
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                />
              </Link>
              ) : (
              <div
                style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "inline-block",
                }}
              />
              )}
            </td>
            <td>{item.item_name}</td>
            <td>{item.item_description}</td>
            <td>{item.item_price}</td>
            <td>{item.item_discount}</td>
            <td>{item.item_quantity}</td>
            <td>
              <span
              className={`badge ${
                item.stock_level === "In Stock"
                ? "bg-success"
                : "bg-secondary"
              }`}
              >
              {item.stock_level}
              </span>
            </td>
            <td>{item.category?.category_name ?? "N/A"}</td>
            <td>
              <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onEditItem(item)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onDeleteItem(item)}
              >
                Delete
              </button>
              </div>
            </td>
            </tr>
          ))
          ) : (
          <tr className="align-middle">
            <td colSpan={10} className="text-center">
            No Items Found
            </td>
          </tr>
          )}
        </tbody>
        </table>
      </div>
      <AddItemModal
        showModal={openAddItemModal}
        onRefreshItems={() => setRefreshItems(!refreshItems)}
        onClose={() => setOpenAddItemModal(false)}
      />
      </div>
    );
};

export default ItemsTable;
