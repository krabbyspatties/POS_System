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
          console.error("Unexpected Status error during storing category: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
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
    <form onSubmit={handleStoreCategory} className="p-3" style={{ minWidth: 240 }}>
      <h6 className="mb-3">Add New Category</h6>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Category name"
          name="category"
          value={state.category}
          onChange={handleInputChange}
          className={`form-control ${state.errors.category_name ? "is-invalid" : ""}`}
          style={{ fontSize: "14px", borderRadius: "8px" }}
        />
        {state.errors.category_name && (
          <div className="invalid-feedback">{state.errors.category_name[0]}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        style={{ fontSize: "14px", borderRadius: "8px" }}
        disabled={state.loadingStore}
      >
        {state.loadingStore ? (
          <>
            <SpinnerSmall /> Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </form>
  );
};

export default AddCategoryForm;
