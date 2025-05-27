import { useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import AlertMessage from "../../AlertMessage";
import DeleteItemForm from "../../forms/items/DeleteItemForm";
import SpinnerSmall from "../../SpinnerSmall";

interface DeleteItemModalProps {
  showModal: boolean;
  item: Items | null;
  onRefreshItems: (refresh: boolean) => void;
  onClose: () => void;
}

const DeleteItemModal = ({
  showModal,
  item,
  onRefreshItems,
  onClose,
}: DeleteItemModalProps) => {
  const submitFormRef = useRef<() => void | null>(null);

  const [refreshItems, setRefreshItems] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);

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
              <h1 className="modal-title fs-5">Delete Item</h1>
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
              <p className="fs-4">
                Are you sure do you want to delete this item?
              </p>
              <DeleteItemForm
                item={item}
                setSubmitForm={submitFormRef}
                setLoadingDestroy={setLoadingDestroy}
                onDeletedItem={(message) => {
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
                disabled={loadingDestroy}
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loadingDestroy}
                onClick={() => submitFormRef.current?.()}
              >
                {loadingDestroy ? (
                  <>
                    <SpinnerSmall /> Deleting Item...
                  </>
                ) : (
                  "Delete Item"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteItemModal;
