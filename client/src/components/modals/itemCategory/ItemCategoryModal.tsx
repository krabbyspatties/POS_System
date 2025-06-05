import { useState } from "react";
import AlertMessage from "../../AlertMessage";
import SpinnerSmall from "../../SpinnerSmall";
import CategoryContent from "../../forms/categories/CategoryContent";

interface AddItemCategoryModalProps {
  showModal: boolean;
  onRefreshItems: (refresh: boolean) => void;
  onClose: () => void;
}

const AddItemCategory = ({
  showModal,
  onRefreshItems,
  onClose,
}: AddItemCategoryModalProps) => {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);

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

  const handleCategoryAdded = (msg: string) => {
    handleShowAlertMessage(msg, true, true);
    onRefreshItems(true);
  };

  if (!showModal) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add Item Category</h1>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
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
              <CategoryContent onCategoryAdded={handleCategoryAdded} />
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

export default AddItemCategory;
