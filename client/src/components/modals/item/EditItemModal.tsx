import { useRef, useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import EditItemForm from "../../forms/items/EditItemForm";
import AlertMessage from "../../AlertMessage";
import SpinnerSmall from "../../SpinnerSmall";

interface EditItemModalProps {
  showModal: boolean;
  item: Items | null;
  onRefreshItems: (refresh: boolean) => void;
  onClose: () => void;
}

const EditItemModal = ({
  showModal,
  item,
  onRefreshItems,
  onClose,
}: EditItemModalProps) => {
  const SubmitFormRef = useRef<() => void | null>(null);

  const [refreshItems, setRefreshItems] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

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
              <h1 className="modal-title fs-5">Edit Item</h1>
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
              <EditItemForm
                item={item}
                setSubmitForm={SubmitFormRef}
                setLoadingUpdate={setLoadingUpdate}
                onItemUpdated={(message) => {
                  handleShowAlertMessage(message, true, true);
                  setRefreshItems(!refreshItems);
                  onRefreshItems(!refreshItems);
                }}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={loadingUpdate}
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={loadingUpdate}
                onClick={() => SubmitFormRef.current?.()}
              >
                {loadingUpdate ? (
                  <>
                    <SpinnerSmall /> Updating Item...
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

export default EditItemModal;
