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

  if (!showModal) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0.5)" }}
      />
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div
          className="modal-dialog modal-lg"
          role="document"
          style={{
            maxWidth: "600px",
            margin: "1.75rem auto",
          }}
        >
          <div
            className="modal-content"
            style={{
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              padding: "1.5rem",
            }}
          >
            <div className="modal-header" style={{ borderBottom: "none" }}>
              <h5 className="modal-title" style={{ fontWeight: 700 }}>
                Add Item
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={loadingStore}
              />
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
                  onRefreshItems(!refreshItems);
                }}
              />
            </div>
            <div
              className="modal-footer"
              style={{ borderTop: "none", justifyContent: "flex-end", gap: 12 }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loadingStore}
                style={{
                  borderRadius: 6,
                  fontWeight: 600,
                  padding: "8px 16px",
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success d-flex align-items-center gap-2"
                disabled={loadingStore}
                onClick={() => submitFormRef.current?.()}
                style={{
                  borderRadius: 6,
                  fontWeight: 600,
                  padding: "8px 16px",
                  fontSize: "1rem",
                  cursor: loadingStore ? "not-allowed" : "pointer",
                }}
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
