import { useEffect, useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import type { OrderItem } from "../../../interfaces/order_item/order_item";

interface ItemsTable {
  refreshItems: boolean;
  orderList: OrderItem[];
  onAdd: (item: Items) => void;
  onRemove: (item: Items) => void;
}

const ProductsTable = ({
  refreshItems,
  orderList,
  onAdd,
  onRemove,
}: ItemsTable) => {
  const [state, setState] = useState({
    loadingItems: true,
    items: [] as Items[],
  });

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedItemRef.current &&
        !selectedItemRef.current.contains(event.target as Node)
      ) {
        setSelectedItemId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: 260,
          backgroundColor: "#007bff",
          color: "#fff",
          padding: 16,
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <h5>Advanced Filter</h5>
        <input
          type="text"
          placeholder="Search by name"
          className="form-control mb-2"
          disabled
        />
        <select className="form-select mb-2" disabled>
          <option value="">Categories</option>
        </select>
        <button
          className="btn btn-primary"
          style={{ border: "2px solid black" }}
          disabled
        >
          Reset Filters
        </button>
      </div>

      <div style={{ flex: 1, padding: 32, marginRight: 400, transition: "margin-right 0.3s" }}>
        <form className="d-flex mt-4" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #e0e0e0",
            marginTop: 20,
            padding: 24,
          }}
        >
          {state.loadingItems ? (
            <div className="py-3 text-center">
              <Spinner />
            </div>
          ) : state.items.length > 0 ? (
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 py-3">
              {state.items.map((item) => (
                <div className="col" key={item.item_id}>
                  <div className="card h-100 shadow-sm product-card">
                    <div
                      className="product-image-wrapper"
                      onClick={() => {
                        const existingOrder = orderList.find(
                          (order) => order.item_id === item.item_id
                        );
                        if (existingOrder) {
                          onRemove(item);
                        } else {
                          onAdd(item);
                        }
                      }}
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <img
                        src={`http://localhost:8000/storage/${
                          item.item_image || "Images/placeholder.png"
                        }`}
                        alt={item.item_name}
                        className="card-img-top product-image"
                      />
                      {selectedItemId === item.item_id && (
                        <div
                          ref={selectedItemRef}
                          className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 p-2 rounded d-flex justify-content-center align-items-center z-2 text-white"
                        >
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6
                        className="card-title product-title"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </h6>
                      <p className="card-text product-description flex-grow-1">
                        {item.item_description}
                      </p>
                      <p className="card-text product-price">
                        <strong>₱{item.item_price.toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 text-center">No Items Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
