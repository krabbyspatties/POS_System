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

  const [state, SetState] = useState({
    loadingGet: true,
    loadingUpdate: false,
    category_id: 0,
    category_name: "",
    errors: {} as CategoryFieldErrors,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    SetState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGetCategory = (category_id: number) => {
    SetState((prevState) => ({
      ...prevState,
      loadingGet: true,
    }));

    ItemCategoryServices.getCategories(category_id)
      .then((res) => {
        if (res.status === 200) {
          SetState((prevState) => ({
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
        SetState((prevState) => ({
          ...prevState,
          loadingGet: false,
        }));
      });
  };

  const handleUpdateCategory = (e: FormEvent) => {
    e.preventDefault();

    SetState((prevState) => ({
      ...prevState,
      loadingUpdate: true,
    }));

    ItemCategoryServices.updateCategories(state.category_id, {
      category_name: state.category_name,
    })
      .then((res) => {
        if (res.status === 200) {
          SetState((prevState) => ({
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
          SetState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        SetState((prevState) => ({
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
        <form onSubmit={handleUpdateCategory}>
          <div className="form-group">
            <div className="mb-3">
              <label htmlFor="category_name">Category</label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.category_name ? "is-invalid" : ""
                }`}
                name="category_name"
                id="category_name"
                value={state.category_name}
                onChange={handleInputChange}
              />
              {state.errors.category_name && (
                <p className="text-danger">{state.errors.category_name[0]}</p>
              )}
            </div>
            <div className="d-flex justify-content-end">
              <Link to="/users" className="btn btn-secondary me-1">
                Back
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
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
          </div>
        </form>
      )}
    </>
  );
};

export default EditCategoryForm;
