import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { ItemFieldErrors } from "../../../interfaces/Item/ItemFieldError";
import type { Items } from "../../../interfaces/Item/Items";
import type { ItemCategories } from "../../../interfaces/itemcategory/ItemCategory";
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
    categories: [] as ItemCategories[],
    item_id: 0,
    item_name: "",
    item_description: "",
    item_price: 0,
    item_discount: 0,
    item_quantity: 0,
    item_image: "" as string | File,
    stock_level: "",
    category_id: null as number | null,
    errors: {} as ItemFieldErrors,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: [
        "item_price",
        "item_discount",
        "item_quantity",
        "category_id",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleLoadCategories = () => {
    ItemCategoryServices.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
          }));
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
        item_price: item.item_price,
        item_discount: item.item_discount,
        item_quantity: item.item_quantity,
        item_image: item.item_image,
        stock_level: item.stock_level,
        category_id: item?.category?.category_id ?? null,

        errors: {},
      }));
    }

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [item, setSubmitForm]);

  return (
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
            <textarea
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
            />
            {state.errors.item_price && (
              <span className="text-danger">{state.errors.item_price[0]}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="item_discount">Discount</label>
            <input
              type="number"
              className={`form-control ${
                state.errors.item_discount ? "is-invalid" : ""
              }`}
              name="item_discount"
              id="item_discount"
              value={state.item_discount}
              onChange={handleInputChange}
            />
            {state.errors.item_discount && (
              <span className="text-danger">
                {state.errors.item_discount[0]}
              </span>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="item_quantity">Quantity</label>
            <input
              type="number"
              className={`form-control ${
                state.errors.item_quantity ? "is-invalid" : ""
              }`}
              name="item_quantity"
              id="item_quantity"
              value={state.item_quantity}
              onChange={handleInputChange}
            />
            {state.errors.item_quantity && (
              <span className="text-danger">
                {state.errors.item_quantity[0]}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="stock_level">Stock Level</label>
            <input
              type="text"
              className={`form-control ${
                state.errors.stock_level ? "is-invalid" : ""
              }`}
              name="stock_level"
              id="stock_level"
              value={state.stock_level}
              onChange={handleInputChange}
            />
            {state.errors.stock_level && (
              <span className="text-danger">{state.errors.stock_level[0]}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="item_image">Image</label>
            <input
              type="file"
              className={`form-control ${
                state.errors.item_image ? "is-invalid" : ""
              }`}
              name="item_image"
              id="item_image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setState((prev) => ({ ...prev, item_image: file }));
                }
              }}
            />
            {state.errors.item_image && (
              <span className="text-danger">{state.errors.item_image[0]}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              className={`form-select ${
                state.errors.category ? "is-invalid" : ""
              }`}
              value={state.category_id ?? ""}
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
        </div>
      </div>
    </form>
  );
};

export default EditItemForm;
