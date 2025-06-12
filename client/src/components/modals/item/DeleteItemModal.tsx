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
    <div
      className={`modal fade ${showModal ? "show d-block" : ""}`}
      tabIndex={-1}
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ maxWidth: 400 }}
      >
        <div className="modal-content" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 48,
              color: "#dc3545",
              marginTop: 20,
              marginBottom: 12,
            }}
            aria-hidden="true"
          >
            &#9888;
          </div>
          <h3
            style={{ marginBottom: 20, fontWeight: "bold", color: "#dc3545" }}
          >
            Confirm Deletion
          </h3>

          <div className="mb-3 px-3">
            <AlertMessage
              message={message}
              isSuccess={isSuccess}
              isVisible={isVisible}
              onClose={handleCloseAlertMessage}
            />
          </div>

          <p style={{ fontSize: 16, marginBottom: 24 }}>
            Are you sure you want to delete this item?
          </p>

          <DeleteItemForm
            item={item}
            setSubmitForm={submitFormRef}
            setLoadingDestroy={setLoadingDestroy}
            onDeletedItem={(message) => {
              handleShowAlertMessage(message, true, true);
              const newRefresh = !refreshItems;
              setRefreshItems(newRefresh);
              onRefreshItems(newRefresh);
              setTimeout(() => onClose(), 1500); // close modal after short delay
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
              padding: "0 16px 24px",
            }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{ flex: 1, marginRight: 10 }}
              disabled={loadingDestroy}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              style={{ flex: 1 }}
              disabled={loadingDestroy}
              onClick={() => submitFormRef.current?.()}
              aria-busy={loadingDestroy}
            >
              {loadingDestroy ? (
                <>
                  <SpinnerSmall /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
