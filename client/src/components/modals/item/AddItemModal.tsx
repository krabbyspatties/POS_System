import { useRef, useState } from "react";
import AlertMessage from "../../AlertMessage";
import ItemForm from "../../forms/items/AddItemsForm";
import SpinnerSmall from "../../SpinnerSmall";

interface AddItemModalProps {
  showModal: boolean;
  onRefreshItems: (refresh: boolean) => void;
  onClose: () => void;
}

const AddItemModal = ({
  showModal,
  onRefreshItems,
  onClose,
}: AddItemModalProps) => {
  const submitFormRef = useRef<() => void | null>(null);

  const [refreshItems, setRefreshItems] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleShowAlertMessage = (
    message: string,
    isSuccess: boolean,
    isVisible: boolean
  ) => {
    setMessage(message);
    setIsSuccess(isSuccess);
    setIsVisible(isVisible);
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };

  return (
    <>
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add Item</h1>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <AlertMessage
                  message={message}
                  isSuccess={isSuccess}
                  isVisible={isVisible}
                  onClose={handleCloseAlertMessage}
                />
              </div>
              <ItemForm
                setSubmitForm={(submitFn) => {
                  submitFormRef.current = submitFn;
                }}
                setLoadingStore={setLoadingStore}
                onItemAdded={(message) => {
                  handleShowAlertMessage(message, true, true);
                  setRefreshItems(!refreshItems);
                  onRefreshItems(refreshItems);
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loadingStore}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loadingStore}
                onClick={() => submitFormRef.current?.()}
              >
                {loadingStore ? (
                  <>
                    <SpinnerSmall /> Saving Item...
                  </>
                ) : (
                  "Save Item"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddItemModal;
