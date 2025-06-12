import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import type { CategoryFieldErrors } from "../../../interfaces/itemcategory/itemCategoryFieldErrors";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import SpinnerSmall from "../../SpinnerSmall";

interface EditCategoryFormProps {
  onCategoryUpdate: (message: string) => void;
}

const EditCategoryForm = ({ onCategoryUpdate }: EditCategoryFormProps) => {
  const { category_id } = useParams();

  const [state, setState] = useState({
    loadingGet: true,
    loadingUpdate: false,
    category_id: 0,
    category_name: "",
    errors: {} as CategoryFieldErrors,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGetCategory = (category_id: number) => {
    setState((prevState) => ({
      ...prevState,
      loadingGet: true,
    }));

    ItemCategoryServices.getCategories(category_id)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category_id: res.data.category.category_id,
            category_name: res.data.category.category_name,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
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

  const handleUpdateCategory = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingUpdate: true,
    }));

    ItemCategoryServices.updateCategories(state.category_id, {
      category_name: state.category_name,
    })
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            errors: {} as CategoryFieldErrors,
          }));
          onCategoryUpdate(res.data.message);
        } else {
          console.error("Unexpected status error while updating: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingUpdate: false,
        }));
      });
  };

  useEffect(() => {
    if (category_id) {
      const parsedId = parseInt(category_id);
      handleGetCategory(parsedId);
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
            minHeight: "60vh",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: 360, // increased width
              background: "linear-gradient(45deg, #000000, #8B0000)",
              color: "#fff",
              padding: 24, // increased padding
              borderRadius: 8,
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
              border: "1px solid #440000",
            }}
          >
            <h5>Edit Category</h5>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-3">
                <label htmlFor="category_name" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    state.errors.category_name ? "is-invalid" : ""
                  }`}
                  name="category_name"
                  id="category_name"
                  value={state.category_name}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "#fff", color: "#000" }}
                />
                {state.errors.category_name && (
                  <div className="invalid-feedback">
                    {state.errors.category_name[0]}
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-end">
                <Link
                  to="/items"
                  className="btn btn-secondary me-2"
                  style={{ minWidth: 80 }}
                >
                  Back
                </Link>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: "linear-gradient(45deg, #28a745, #218838)",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    minWidth: 80,
                  }}
                  disabled={state.loadingUpdate}
                >
                  {state.loadingUpdate ? (
                    <>
                      <SpinnerSmall />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategoryForm;
