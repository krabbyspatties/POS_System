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
    loadingGCategory: true,
    itemCategories: [] as ItemCategories[],
  });

  const handleLoadCategories = () => {
    ItemCategoryServices.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            itemCategories: res.data.categories,
          }));
        } else {
          console.error("Unexpected status error during loading genders");
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingGCategory: false,
        }));
      });
  };

  useEffect(() => {
    handleLoadCategories();
  }, [refreshCategory]);

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>No</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingGCategory ? (
            <tr className="align-middle">
              <td colSpan={3} className="text-center mt-6">
                <Spinner />
              </td>
            </tr>
          ) : state.itemCategories.length > 0 ? (
            state.itemCategories.map((category_name, index) => (
              <tr className="align-middle" key={index}>
                <td>{index + 1}</td>
                <td>{category_name.category_name}</td>
                <td>
                  <div className="btn-group">
                    <Link
                      to={`/itemCategories/edit/${category_name.category_id}`}
                      className="btn btn-success"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/itemCategories/delete/${category_name.category_id}`}
                      className="btn btn-danger"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="align-middle">
              <td colSpan={9} className="text-center">
                No Categories Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CategoryTable;
