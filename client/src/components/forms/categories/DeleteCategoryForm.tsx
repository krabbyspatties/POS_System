import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "../../Spinner";
import { Link } from "react-router-dom";
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
    console.log("Sending delete request for category:", category_id);

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
            "Unexpected statuse error while geting category: ",
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
            "Unexpected Status error while destroying Category: ",
            res.status
          );
        }
      })
      .catch((error) => {
        console.error(error, null);
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
      console.error("invalid category_id: ", category_id);
    }
  }, [category_id]);

  return (
    <>
      {state.loadingGet ? (
        <div className="text-center mt-5">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleDestroyCategory}>
          <h3>Are you sure you want to delete this category? </h3>
          <div className="for-group">
            <div className="mb-3">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                id="category"
                value={state.category_name}
                readOnly
              />
            </div>
            <div className="d-flex justify-content-end">
              <Link
                to={"/ItemCategories"}
                className={`btn btn-secondary me-3 ${
                  state.loadingDestroy ? "disabled" : ""
                }`}
              >
                Back
              </Link>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={state.loadingDestroy}
              >
                {state.loadingDestroy ? (
                  <>
                    <SpinnerSmall /> Deleting...
                  </>
                ) : (
                  "YES"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteCategoryForm;
