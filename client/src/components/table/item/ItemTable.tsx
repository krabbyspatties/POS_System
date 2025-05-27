import { useEffect, useState } from "react";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import { Link } from "react-router-dom";
import type { Items } from "../../../interfaces/Item/Items";

interface ItemsTable {
  refreshItems: boolean;
  // onShowItem: (item: Items) => void;
  onEditItem: (item: Items) => void;
  onDeleteItem: (item: Items) => void;
}

const ItemsTable = ({
  refreshItems,
  // onShowItem,
  onEditItem,
  onDeleteItem,
}: ItemsTable) => {
  const [state, setState] = useState({
    loadingItems: true,
    items: [] as Items[],
  });

  const handleLoadItems = () => {
    ItemService.loadItems()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            items: res.data.items,
          }));
        } else {
          console.error(
            "Unexpected status error while loading items: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingItems: false,
        }));
      });
  };

  useEffect(() => {
    handleLoadItems();
  }, [refreshItems]);

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
            <th>Stocks</th>
            <th>Status</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingItems ? (
            <tr className="align-middle">
              <td colSpan={9} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : state.items.length > 0 ? (
            state.items.map(
              (item, index) => (
                console.log(item),
                (
                  <tr className="align-middle" key={item.item_id}>
                    <td>{index + 1}</td>
                    <td>
                      {item.item_image ? (
                        <Link to={`/items/${item.item_id}`}>
                          <img
                            src={item.item_image}
                            alt={item.item_name}
                            style={{
                              width: 40,
                              height: 40,
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
                    <td>{`${item.item_name}`}</td>
                    <td>{item.item_description}</td>
                    <td>{item.item_price}</td>
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
                )
              )
            )
          ) : (
            <tr className="align-middle">
              <td colSpan={9} className="text-center">
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
