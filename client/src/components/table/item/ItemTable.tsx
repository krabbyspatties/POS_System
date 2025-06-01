import type { Items } from "../../../interfaces/Item/Items";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner";

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
  return (
    <>
      <table className="table table-hover">
        <thead>
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
            <tr className="align-middle">
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
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
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
                <td>{item.stock_level}</td>
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
    </>
  );
};

export default ItemsTable;
