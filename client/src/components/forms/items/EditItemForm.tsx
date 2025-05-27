import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Items } from "../../../interfaces/Item/Items";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
import type { ItemFieldErrors } from "../../../interfaces/Item/ItemFieldError";
import ItemCategoryServices from "../../../services/ItemCategoryService";
import ErrorHandler from "../../handler/ErrorHandler";
import ItemService from "../../../services/ItemService";

interface EditItemFormProps {
  item: Items | null;
  setSubmitForm: React.MutableRefObject<(() => void) | null>;
  setLoadingUpdate: (loading: boolean) => void;
  onItemUpdated: (message: string) => void;
}

const EditItemForm = ({
  item,
  setSubmitForm,
  setLoadingUpdate,
  onItemUpdated,
}: EditItemFormProps) => {
  const [state, setState] = useState({
    loadingCategories: true,
    category: [] as ItemCategories[],
    item_id: 0,
    item_name: "",
    item_description: "",
    item_price: "",
    item_quantity: "",
    item_image: "",
    stock_level: "",
    category_id: "",
    errors: {} as ItemFieldErrors,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoadCategories = () => {
    ItemCategoryServices.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category: res.data.categories,
          }));
        } else {
          console.error(
            "Unexpectedstatus error while loading gender: ",
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
          loadingCategories: false,
        }));
      });
  };

  const handleUpdateItem = (e: FormEvent) => {
    e.preventDefault();

    setLoadingUpdate(true);

    ItemService.updateItem(state.item_id, state)
      .then((res) => {
        if (res.status === 200) {
          onItemUpdated(res.data.message);
        } else {
          console.error(
            "Unexpected status error while updating item: ",
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
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    handleLoadCategories();

    if (item) {
      setState((prevState) => ({
        ...prevState,
        item_id: item.item_id,
        item_name: item.item_name,
        item_description: item.item_description,
        item_price: item.item_price.toString(),
        item_quantity: item.item_quantity.toString(),
        item_image: item.item_image || "",
        stock_level: item.stock_level.toString(),
        category_id: item.category.toString(),
        errors: {} as ItemFieldErrors,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        item_id: 0,
        item_name: "",
        item_description: "",
        item_price: "",
        item_quantity: "",
        item_image: "",
        stock_level: "",
        category_id: "",
        errors: {} as ItemFieldErrors,
      }));
    }

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [item, setSubmitForm]);

  return (
    <>
      <form ref={formRef} onSubmit={handleUpdateItem}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="item_name">Item Name</label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.item_name ? "is-invalid" : ""
                }`}
                name="item_name"
                id="item_name"
                value={state.item_name}
                onChange={handleInputChange}
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
                className={`form-control ${
                  state.errors.item_price ? "is-invalid" : ""
                }`}
                name="item_price"
                id="item_price"
                value={state.item_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
              {state.errors.item_price && (
                <span className="text-danger">
                  {state.errors.item_price[0]}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="item_quantity">Stocks</label>
              <input
                type="text"
                className={`form-control ${
                  state.errors.item_quantity ? "is-invalid" : ""
                }`}
                name="item_quantity"
                id="item_quantity"
                value={state.item_quantity}
                disabled
              />
              {state.errors.item_quantity && (
                <span className="text-danger">
                  {state.errors.item_quantity[0]}
                </span>
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

            <div className="mb-3">
              <label htmlFor="category_id">Category</label>
              <select
                className={`form-select ${
                  state.errors.category ? "is-invalid" : ""
                }`}
                name="category_id"
                id="category_id"
                value={state.category_id}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {state.loadingCategories ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  state.category.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))
                )}
              </select>
              {state.errors.category && (
                <span className="text-danger">{state.errors.category[0]}</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditItemForm;
