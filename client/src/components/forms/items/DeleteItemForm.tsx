import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";

interface DeleteItemFormProps {
  item: Items | null;
  setSubmitForm: React.MutableRefObject<(() => void) | null>;
  setLoadingDestroy: (loading: boolean) => void;
  onDeletedItem: (message: string) => void;
}

const DeleteItemForm = ({
  item,
  setSubmitForm,
  setLoadingDestroy,
  onDeletedItem,
}: DeleteItemFormProps) => {
  const [state, setState] = useState({
    item_id: 0,
    item_name: "",
  });

  const handleDestroyItem = (e: FormEvent) => {
    e.preventDefault();

    setLoadingDestroy(true);

    ItemService.destroyItem(state.item_id)
      .then((res) => {
        if (res.status === 200) {
          onDeletedItem(res.data.message);
        } else {
          console.error(
            "Unexpected status error while destroying item: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setLoadingDestroy(false);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (item) {
      setState((prevState) => ({
        ...prevState,
        item_id: item.item_id,
        item_name: item.item_name,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        item_id: 0,
        item_name: "",
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
      <form ref={formRef} onSubmit={handleDestroyItem}>
        <div className="row">
          <div className="d-flex justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="item_name">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={state.item_name}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default DeleteItemForm;
