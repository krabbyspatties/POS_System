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
      <div
        style={{
          display: "flex",
          minHeight: "50vh",
          justifyContent: "flex-start", // aligns left, we'll add margin to move right
          alignItems: "flex-start",
          paddingTop: 20,
          paddingLeft: 50, // move entire container a bit right
        }}
      >
        <div
          style={{
            width: 260,
            background: "linear-gradient(45deg, #000000, #8B0000)", // black-red gradient background behind form only
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            border: "1px solid #440000",
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
              style={{ backgroundColor: "#fff", color: "#000" }}
            />
            {state.errors.category_name && (
              <p className="text-danger">{state.errors.category_name[0]}</p>
            )}
            <button
              type="submit"
              className="btn"
              style={{
                background: "linear-gradient(45deg, #28a745, #218838)", // green gradient
                border: "none",
                color: "white",
                fontWeight: "bold",
                width: "100%",
              }}
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
