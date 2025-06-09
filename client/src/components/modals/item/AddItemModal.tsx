import { useEffect, useRef, useState } from "react";
import AlertMessage from "../../AlertMessage";
import ItemForm from "../../forms/items/AddItemsForm";
import SpinnerSmall from "../../SpinnerSmall";

interface AddItemModalProps {
  showModal: boolean;
  onRefreshItems: () => void;
  onClose: () => void;
}

const AddItemModal = ({
  showModal,
  onRefreshItems,
  onClose,
}: AddItemModalProps) => {
  const submitFormRef = useRef<() => void | null>(null);

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

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add Item</h1>
              <button
                type="button"
                className="btn-close"
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
                  onRefreshItems(); // Refresh parent item list
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
