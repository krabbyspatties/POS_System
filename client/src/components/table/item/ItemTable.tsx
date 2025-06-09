import type { Items } from "../../../interfaces/Item/Items";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner";
import AddItemModal from "../../modals/item/AddItemModal";
import { useState } from "react";
import AddItemCategory from "../../modals/itemCategory/ItemCategoryModal";

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
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false); // fixed naming
  const [refreshItems, setRefreshItems] = useState(false);

  return (
    <div style={{ flex: 1, padding: 32, backgroundColor: "#f8f9fa" }}>
      {/* Top Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <button
          className="btn btn-success btn-sm"
          style={{
            fontSize: "1rem",
            padding: "8px 16px",
            fontWeight: "600",
            borderRadius: 6,
          }}
          onClick={() => setOpenAddItemModal(true)}
        >
          + Add Item
        </button>
        <button
          className="btn btn-primary btn-sm"
          style={{
            fontSize: "1rem",
            padding: "8px 16px",
            fontWeight: "600",
            borderRadius: 6,
          }}
          onClick={() => setOpenAddCategoryModal(true)}
        >
          + Add Category
        </button>
      </div>
  
      {/* Table Wrapper */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          padding: 16,
        }}
      >
        <table className="table table-hover mb-0" style={{ width: "100%" }}>
          <thead className="table-light">
            <tr style={{ fontSize: "1rem" }}>
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
                          src={`http://localhost:8000/storage/${item.item_image}`}
                          alt={item.item_name}
                          className="rounded-circle img-thumbnail"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: "50%",
                            cursor: "pointer",
                            border: "2px solid #6c757d",
                          }}
                        />
                      </Link>
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          display: "inline-block",
                        }}
                      />
                    )}
                  </td>
                  <td>{item.item_name}</td>
                  <td>{item.item_description}</td>
                  <td>₱{Number(item.item_price).toFixed(2)}</td>
                  <td>{item.item_discount}%</td>
                  <td>{item.item_quantity}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.stock_level === "In Stock"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                      style={{
                        fontSize: "0.85rem",
                        padding: "5px 12px",
                        borderRadius: 12,
                      }}
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
                        style={{ padding: "4px 10px", fontSize: "0.9rem" }}
                        onClick={() => onEditItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ padding: "4px 10px", fontSize: "0.9rem" }}
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
  
      {/* Modals */}
      <AddItemModal
        showModal={openAddItemModal}
        onRefreshItems={() => setRefreshItems(!refreshItems)}
        onClose={() => setOpenAddItemModal(false)}
      />
  
      <AddItemCategory
        showModal={openAddCategoryModal}
        onRefreshItems={() => setRefreshItems(!refreshItems)}
        onClose={() => setOpenAddCategoryModal(false)}
      />
    </div>
  );
  
};

export default ItemsTable;
