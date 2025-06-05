import SpinnerSmall from "../../SpinnerSmall";
import type { CategoryFieldErrors } from "../../../interfaces/itemcategory/itemCategoryFieldErrors";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ErrorHandler from "../../handler/ErrorHandler";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface AddCategoriesFormProps {
  onCategoryAdded: (message: string) => void;
}

const AddCategoryForm = ({ onCategoryAdded }: AddCategoriesFormProps) => {
  const [state, setState] = useState({
    loadingStore: false,
    category: "",
    errors: {} as CategoryFieldErrors,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStoreCategory = (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      category_name: state.category,
    };

    setState((prevState) => ({
      ...prevState,
      loadingStore: true,
    }));

    ItemCategoryServices.storeCategories(formData)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category: "",
            errors: {} as CategoryFieldErrors,
          }));

          onCategoryAdded(res.data.message);
        } else {
          console.error(
            "Unexpected Status error during storing category: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
        }
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStore: false,
        }));
      });
  };

  return (
    <>
      <div style={{ display: "flex", minHeight: "50vh" }}>
        <div
          style={{
            width: 260,
            backgroundColor: "#007bff",
            color: "#fff",
            padding: 16,
            top: 100,
          }}
        >
          <h5>Add Category</h5>
          <form onSubmit={handleStoreCategory}>
            <input
              type="text"
              placeholder="Category name"
              className={`form-control mb-2 ${
                state.errors.category_name ? "is-invalid" : ""
              }`}
              name="category"
              value={state.category}
              onChange={handleInputChange}
            />
            {state.errors.category_name && (
              <p className="text-danger">{state.errors.category_name[0]}</p>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ border: "2px solid black" }}
              disabled={state.loadingStore}
            >
              {state.loadingStore ? (
                <>
                  <SpinnerSmall /> Loading...
                </>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCategoryForm;
