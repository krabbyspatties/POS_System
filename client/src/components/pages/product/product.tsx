import { useEffect, useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import type { OrderItem } from "../../../interfaces/order_item/order_item";
import SpinnerSmall from "../../SpinnerSmall";

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
    categories: [] as ItemCategories[],
    filteredItems: [] as Items[],
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadItems = (page = 1, reset = false) => {
    setState((prev) => ({ ...prev, loadingItems: true }));

    Promise.all([
      ItemService.loadItems(page, 10),
      ItemCategoryServices.loadCategories(),
    ])
      .then(([itemsRes, categoriesRes]) => {
        if (itemsRes.status === 200 && categoriesRes.status === 200) {
          const newItems = itemsRes.data.items;

          setState((prev) => ({
            ...prev,
            items: reset ? newItems : [...prev.items, ...newItems],
            categories: categoriesRes.data.categories,
            filteredItems: reset ? newItems : [...prev.items, ...newItems],
            loadingItems: false,
          }));

          setHasMore(itemsRes.data.current_page < itemsRes.data.last_page);
        } else {
          console.error("Failed to load items or categories");
          setState((prev) => ({ ...prev, loadingItems: false }));
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
        setState((prev) => ({ ...prev, loadingItems: false }));
      });
  };

  useEffect(() => {
    setPage(1);
    handleLoadItems(1, true);
  }, [refreshItems]);

  useEffect(() => {
    let filtered = [...state.items];

    if (filters.search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== "") {
      filtered = filtered.filter(
        (item) => item.category?.category_id?.toString() === filters.category
      );
    }

    if (filters.sort === "price_asc") {
      filtered.sort((a, b) => Number(a.item_price) - Number(b.item_price));
    } else if (filters.sort === "price_desc") {
      filtered.sort((a, b) => Number(b.item_price) - Number(a.item_price));
    }

    setState((prev) => ({ ...prev, filteredItems: filtered }));
  }, [filters, state.items]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: "", category: "", sort: "" });
  };

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
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className="p-4 shadow-lg text-white"
        style={{
          width: 260,
          background: "linear-gradient(90deg, #000000 0%, #b30000 100%)",
          fontSize: "0.9rem",
        }}
      >
        <h5 className="fw-bold mb-4">Filter Items</h5>

        <div className="mb-3">
          <label htmlFor="search" className="form-label fw-semibold">
            🔍 Search
          </label>
          <input
            id="search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Type item name..."
            className="form-control form-control-sm shadow-sm rounded"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label fw-semibold">
            📂 Category
          </label>
          <select
            id="category"
            className="form-select form-select-sm shadow-sm rounded"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {state.categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id.toString()}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="sort" className="form-label fw-semibold">
            💰 Sort by Price
          </label>
          <select
            id="sort"
            className="form-select form-select-sm shadow-sm rounded"
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
          >
            <option value="">None</option>
            <option value="price_asc">⬇ Low to High</option>
            <option value="price_desc">⬆ High to Low</option>
          </select>
        </div>

        <button
          className="btn btn-light w-100"
          style={{
            border: "2px solid #8B0000",
            fontWeight: "bold",
            color: "#8B0000",
            backgroundColor: "#fff",
          }}
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </aside>

      {/* Product Area */}
      <main className="flex-grow-1 p-4" style={{ marginRight: 400 }}>
        <section className="bg-white p-4 rounded shadow-lg mt-4">
          {state.loadingItems && page === 1 ? (
            <div className="text-center py-4">
              <Spinner />
            </div>
          ) : state.filteredItems.length > 0 ? (
            <>
              <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 border border-white border-3">
                {state.filteredItems.map((item) => {
                  const isSelected = orderList.some(
                    (order) => order.item_id === item.item_id
                  );

                  return (
                    <div className="col" key={item.item_id}>
                      <div className="card h-100 border border-white border-3 shadow p-3 bg-white rounded-4 overflow-hidden">
                        <div
                          className="position-relative cursor-pointer"
                          role="button"
                          onClick={() => {
                            isSelected ? onRemove(item) : onAdd(item);
                            setSelectedItemId(item.item_id);
                          }}
                          aria-pressed={isSelected}
                        >
                          <img
                            src={`http://localhost:8000/storage/${
                              item.item_image || "Images/placeholder.png"
                            }`}
                            className="card-img-top"
                            alt={item.item_name}
                            style={{
                              height: "160px",
                              objectFit: "cover",
                              borderBottom: "1px solid #eee",
                            }}
                          />
                          {selectedItemId === item.item_id && (
                            <div
                              ref={selectedItemRef}
                              className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 text-white px-3 py-2 rounded shadow-sm"
                              style={{ fontSize: "0.85rem", fontWeight: 600 }}
                            >
                              ✅ Selected
                            </div>
                          )}
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h6
                            className="card-title text-truncate fw-semibold text-primary mb-1"
                            title={item.item_name}
                            style={{ fontSize: "1rem" }}
                          >
                            {item.item_name}
                          </h6>
                          <p
                            className="card-text small text-muted mb-2 flex-grow-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {item.item_description}
                          </p>
                          <p
                            className="card-text fw-bold text-success mb-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            ₱{item.item_price.toLocaleString()}
                          </p>
                          <p
                            className="card-text fw-semibold"
                            style={{
                              fontSize: "0.85rem",
                              color:
                                item.item_quantity === 0
                                  ? "red"
                                  : item.item_quantity <= 100
                                  ? "orange"
                                  : "green",
                            }}
                          >
                            Stock: {item.item_quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      handleLoadItems(nextPage);
                    }}
                    disabled={state.loadingItems}
                  >
                    {state.loadingItems ? (
                      <>
                        <SpinnerSmall />{" "}
                        <span className="ms-2">Loading...</span>
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}

              {/* No More Items Message */}
              {!hasMore && (
                <div className="text-center py-3 text-muted small">
                  No more items to load.
                </div>
              )}
            </>
          ) : (
            <div
              className="text-center py-4 text-muted"
              style={{ fontSize: "0.9rem" }}
            >
              No Items Found
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductsTable;
