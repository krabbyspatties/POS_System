import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { ItemFieldErrors } from "../../../interfaces/Item/ItemFieldError";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import ItemCategoryServices from "../../../services/ItemCategoryService";

interface AddItemFormProps {
  setSubmitForm: (submitFn: () => void) => void;
  setLoadingStore: (loading: boolean) => void;
  onItemAdded: (message: string) => void;
}

const ItemForm = ({
  setSubmitForm,
  setLoadingStore,
  onItemAdded,
}: AddItemFormProps) => {
  const [state, setState] = useState({
    loadingCategories: true,
    categories: [] as ItemCategories[],
    item_name: "",
    item_description: "",
    item_price: "",
    item_quantity: "",
    item_image: "",
    stock_level: "",
    category_id: "",
    errors: {} as ItemFieldErrors,
  });

  const handleResetNecessaryFields = () => {
    setState((prevState) => ({
      ...prevState,
      item_name: "",
      item_description: "",
      item_price: "",
      item_quantity: "",
      item_image: "",
      stock_level: "",
      category: "",
      errors: {} as ItemFieldErrors,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setState((prevState) => {
      let updatedState: any = {
        ...prevState,
        [name]: value,
      };

      if (name === "item_quantity") {
        const quantity = parseInt(value);
        if (isNaN(quantity) || quantity <= 0) {
          updatedState.stock_level = "unavailable";
        } else if (quantity <= 100) {
          updatedState.stock_level = "low_inventory";
        } else {
          updatedState.stock_level = "available";
        }
      }

      return updatedState;
    });
  };

  const handleStoreItem = (e: FormEvent) => {
    e.preventDefault();

    setLoadingStore(true);

    ItemService.storeItem(state)
      .then((res) => {
        if (res.status === 200) {
          handleResetNecessaryFields();
          onItemAdded(res.data.message);
        } else {
          console.error(
            "Unexpected status error while storing user: ",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log("Validation errors:", error.response.data.errors);
        }
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setLoadingStore(false);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (setSubmitForm) {
      setSubmitForm(() => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      });
    }
  }, [setSubmitForm]);

  useEffect(() => {
    ItemCategoryServices.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
            loadingCategories: false,
          }));
        }
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        setState((prevState) => ({
          ...prevState,
          loadingCategories: false,
        }));
      });
  }, []);

  return (
    <form ref={formRef} onSubmit={handleStoreItem}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="first_name">Item Name</label>
            <input
              type="text"
              className={`form-control ${
                state.errors.item_name ? "is-invalid" : ""
              }`}
              name="item_name"
              id="item_name"
              value={state.item_name}
              onChange={handleInputChange}
              maxLength={55}
            />
            {state.errors.item_name && (
              <span className="text-danger">{state.errors.item_name[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="item_description">Description</label>
            <input
              type="text"
              className={`form-control ${
                state.errors.item_description ? "is-invalid" : ""
              }`}
              name="item_description"
              id="item_description"
              value={state.item_description}
              onChange={handleInputChange}
              maxLength={55}
            />
            {state.errors.item_description && (
              <span className="text-danger">
                {state.errors.item_description[0]}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="item_price">Price</label>
            <input
              type="number"
              step="0.01"
              className={`form-control ${
                state.errors.item_price ? "is-invalid" : ""
              }`}
              name="item_price"
              id="item_price"
              value={state.item_price}
              onChange={handleInputChange}
              min="0"
            />
            {state.errors.item_price && (
              <span className="text-danger">{state.errors.item_price[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="item_quantity">Stocks</label>
            <input
              type="number"
              className={`form-control ${
                state.errors.item_quantity ? "is-invalid" : ""
              }`}
              name="item_quantity"
              id="item_quantity"
              value={state.item_quantity}
              onChange={handleInputChange}
              min="0"
            />
            {state.errors.item_quantity && (
              <span className="text-danger">
                {state.errors.item_quantity[0]}
              </span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="category_id">Category</label>
            <select
              name="category_id"
              id="category_id"
              className={`form-select ${
                state.errors.category ? "is-invalid" : ""
              }`}
              value={state.category_id}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {state.loadingCategories ? (
                <option value="">Loading...</option>
              ) : (
                state.categories.map((category, index) => (
                  <option value={category.category_id} key={index}>
                    {category.category_name}
                  </option>
                ))
              )}
            </select>
            {state.errors.category && (
              <span className="text-danger">{state.errors.category}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="item_image">Image URL</label>
            <input
              type="text"
              className={`form-control ${
                state.errors.item_image ? "is-invalid" : ""
              }`}
              name="item_image"
              id="item_image"
              value={state.item_image}
              onChange={handleInputChange}
              maxLength={255}
            />
            {state.errors.item_image && (
              <span className="text-danger">{state.errors.item_image[0]}</span>
            )}
          </div>
          <div className="mb-3">
            <label>Status</label>
            <input
              type="text"
              className="form-control"
              value={state.stock_level}
              readOnly
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ItemForm;
