import { useEffect, useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import ItemCategoryServices from "../../../services/ItemCategoryService";
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

  const handleLoadItems = () => {
    setState((prev) => ({ ...prev, loadingItems: true }));

    Promise.all([ItemService.loadItems(), ItemCategoryServices.loadCategories()])
      .then(([itemsRes, categoriesRes]) => {
        if (itemsRes.status === 200 && categoriesRes.status === 200) {
          setState((prev) => ({
            ...prev,
            items: itemsRes.data.items,
            categories: categoriesRes.data.categories,
            filteredItems: itemsRes.data.items,
            loadingItems: false,
          }));
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
    handleLoadItems();
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
        (item) => item.category?.toString() === filters.category
      );
    }

    if (filters.sort === "price_asc") {
      filtered.sort((a, b) => a.item_price - b.item_price);
    } else if (filters.sort === "price_desc") {
      filtered.sort((a, b) => b.item_price - a.item_price);
    }

    setState((prev) => ({ ...prev, filteredItems: filtered }));
  }, [filters, state.items]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      sort: "",
    });
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
    <div
      className="d-flex p-3"
      style={{ gap: "20px", marginTop: "70px", minHeight: "100vh" }}
    >
      {/* Sidebar Filters */}
      <div
        style={{
          width: 260,
          backgroundColor: "#f8f9fa",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <h6 className="fw-bold mb-3">Filter Products</h6>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name"
          className="form-control mb-2"
        />
        <select
          className="form-select mb-2"
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
        <select
          className="form-select mb-2"
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
        >
          <option value="">Sort by Price</option>
          <option value="price_asc">Low to High</option>
          <option value="price_desc">High to Low</option>
        </select>
        <button
          className="btn btn-outline-secondary w-100"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Main Item Grid */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #e0e0e0",
            padding: 24,
          }}
        >
          {state.loadingItems ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : state.filteredItems.length > 0 ? (
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4">
              {state.filteredItems.map((item) => (
                <div className="col" key={item.item_id}>
                  <div className="card h-100 shadow-sm">
                    <div
                      className="position-relative"
                      onClick={() => {
                        const isInOrder = orderList.find(
                          (o) => o.item_id === item.item_id
                        );
                        isInOrder ? onRemove(item) : onAdd(item);
                        setSelectedItemId(item.item_id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={`http://localhost:8000/storage/${
                          item.item_image || "Images/placeholder.png"
                        }`}
                        alt={item.item_name}
                        className="card-img-top"
                      />
                      {selectedItemId === item.item_id && (
                        <div
                          ref={selectedItemRef}
                          className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-75 p-2 rounded text-white"
                        >
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <h6
                        className="card-title text-truncate"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </h6>
                      <p className="card-text small text-muted">
                        {item.item_description}
                      </p>
                      <p className="card-text fw-bold mb-0">
                        ₱{item.item_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">No Items Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
