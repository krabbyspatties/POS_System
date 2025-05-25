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
      <form onSubmit={handleStoreCategory}>
        <div className="form-group">
          <div className="mb-3">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className={`form-control  ${
                state.errors.category ? "is-invalid" : ""
              }`}
              id="category"
              name="category"
              value={state.category}
              onChange={handleInputChange}
            />
            {state.errors.category && (
              <p className="text-danger">{state.errors.category[0]}</p>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
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
          </div>
        </div>
      </form>
    </>
  );
};

export default AddCategoryForm;
