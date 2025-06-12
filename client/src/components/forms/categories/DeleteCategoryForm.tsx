import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import SpinnerSmall from "../../SpinnerSmall";

interface DeleteCategoryFormProps {
  onDeleteCategory: (message: string) => void;
}

const DeleteCategoryForm = ({ onDeleteCategory }: DeleteCategoryFormProps) => {
  const { category_id } = useParams();
  const [state, setState] = useState({
    loadingGet: true,
    loadingDestroy: false,
    category_id: 0,
    category_name: "",
  });

  const handleGetCategory = (category_id: number) => {
    ItemCategoryServices.getCategories(category_id)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category_id: res.data.category.category_id,
            category_name: res.data.category.category_name,
          }));
        } else {
          console.error(
            "Unexpected status error while getting category: ",
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
          loadingGet: false,
        }));
      });
  };

  const handleDestroyCategory = (e: FormEvent) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      loadingDestroy: true,
    }));

    ItemCategoryServices.destroyCategories(state.category_id)
      .then((res) => {
        if (res.status === 200) {
          onDeleteCategory(res.data.message);
        } else {
          console.error(
            "Unexpected Status error while destroying category: ",
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
          loadingDestroy: false,
        }));
      });
  };

  useEffect(() => {
    if (category_id) {
      const parsedCategoryId = parseInt(category_id);
      handleGetCategory(parsedCategoryId);
    } else {
      console.error("Invalid category_id: ", category_id);
    }
  }, [category_id]);

  return (
    <>
      {state.loadingGet ? (
        <div className="text-center mt-5">
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            padding: 20,
          }}
        >
          <form
            onSubmit={handleDestroyCategory}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 24,
              width: 360,
              boxShadow:
                "0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 48, color: "#dc3545", marginBottom: 12 }}
              aria-hidden="true"
            >
              &#9888;
            </div>
            <h3
              style={{ marginBottom: 20, fontWeight: "bold", color: "#dc3545" }}
            >
              Confirm Deletion
            </h3>
            <p style={{ fontSize: 16, marginBottom: 24 }}>
              Are you sure you want to delete this category?
            </p>
            <input
              type="text"
              className="form-control mb-3"
              readOnly
              value={state.category_name}
              aria-label="Category name"
              style={{ fontWeight: "600", textAlign: "center" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link
                to="/itemcategories"
                className="btn btn-outline-secondary"
                style={{ flex: 1, marginRight: 10 }}
                aria-disabled={state.loadingDestroy}
                tabIndex={state.loadingDestroy ? -1 : 0}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-danger"
                style={{ flex: 1 }}
                disabled={state.loadingDestroy}
                aria-busy={state.loadingDestroy}
              >
                {state.loadingDestroy ? (
                  <>
                    <SpinnerSmall /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default DeleteCategoryForm;
