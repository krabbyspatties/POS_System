import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../Spinner";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import ErrorHandler from "../../handler/ErrorHandler";

interface CategoryTableProps {
  refreshCategory: boolean;
}

const CategoryTable = ({ refreshCategory }: CategoryTableProps) => {
  const [state, setState] = useState({
    loadingCategories: true,
    itemCategories: [] as ItemCategories[],
  });

  const loadCategories = () => {
    setState((prev) => ({ ...prev, loadingCategories: true }));

    ItemCategoryServices.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prev) => ({
            ...prev,
            itemCategories: res.data.categories,
          }));
        } else {
          console.error("Unexpected status error during loading categories");
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loadingCategories: false }));
      });
  };

  useEffect(() => {
    loadCategories();
  }, [refreshCategory]);

  return (
    <div className="p-3">
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
        className="p-3"
      >
        <h6 className="mb-3">Category List</h6>
        <table className="table table-bordered table-sm mb-0" style={{ fontSize: "14px" }}>
          <thead className="table-light">
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Category Name</th>
              <th style={{ width: "140px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.loadingCategories ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  <Spinner />
                </td>
              </tr>
            ) : state.itemCategories.length > 0 ? (
              state.itemCategories.map((category, index) => (
                <tr key={category.category_id}>
                  <td>{index + 1}</td>
                  <td>{category.category_name}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/itemCategories/edit/${category.category_id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/itemCategories/delete/${category.category_id}`}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-muted py-3">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
