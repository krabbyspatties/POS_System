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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: 1, padding: 32 }}>
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
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.loadingCategories ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : state.itemCategories.length > 0 ? (
                state.itemCategories.map((category, index) => (
                  <tr className="align-middle" key={category.category_id}>
                    <td>{index + 1}</td>
                    <td>{category.category_name}</td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/itemCategories/edit/${category.category_id}`}
                          className="btn btn-primary btn-sm"
                          style={{ marginRight: 8 }}
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/itemCategories/delete/${category.category_id}`}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="align-middle">
                  <td colSpan={3} className="text-center">
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
