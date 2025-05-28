import { useEffect, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";

interface ItemsTable {
  refreshItems: boolean;
  // onShowItem: (item: Items) => void;
  //   onEditItem: (item: Items) => void;
  //   onDeleteItem: (item: Items) => void;
}

const ProductsTable = ({
  refreshItems,
}: // onShowItem,
//   onEditItem,
//   onDeleteItem,
ItemsTable) => {
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
      <>
        <div className="container py-3">
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

          {state.loadingItems ? (
            <div className="py-3 text-center">
              <Spinner />
            </div>
          ) : state.items.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-5 g-3 py-3">
              {state.items.map((item) => (
                <div className="col" key={item.item_id}>
                  <div className="card h-100">
                    {item.item_image && (
                      <img
                        src={`http://localhost:8000/storage/${
                          item.item_image ?? "images/placeholder.png"
                        }`}
                        alt={item.item_name}
                        className="card-img-top"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{item.item_name}</h5>
                      <p className="card-text">{item.item_description}</p>
                      <p className="card-text">
                        <strong>₱{item.item_price}</strong>
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
      </>
    </>
  );
};

export default ProductsTable;
