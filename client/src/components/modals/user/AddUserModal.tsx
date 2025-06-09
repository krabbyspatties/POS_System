import { useRef, useState } from "react";
import AlertMessage from "../../AlertMessage";
import SpinnerSmall from "../../SpinnerSmall";
import UserForm from "../../forms/users/UserForm";

interface AddUserModalProps {
  showModal: boolean;
  onRefreshUsers: () => void;
  onClose: () => void;
}

const AddUserModal = ({
  showModal,
  onRefreshUsers,
  onClose,
}: AddUserModalProps) => {
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
                Add User
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
              <UserForm
                setSubmitForm={(submitFn) => {
                  submitFormRef.current = submitFn;
                }}
                setLoadingStore={setLoadingStore}
                onUserAdded={(message) => {
                  handleShowAlertMessage(message, true, true);
                  onRefreshUsers();
                }}
              />
            </div>
            <div
              className="modal-footer"
              style={{ borderTop: "none", justifyContent: "flex-end", gap: 12 }}
            >
              <button
                type="button"
                className="btn"
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  borderRadius: 6,
                  fontWeight: 600,
                  padding: "8px 16px",
                  fontSize: "1rem",
                  cursor: loadingStore ? "not-allowed" : "pointer",
                  border: "none",
                }}
                onClick={onClose}
                disabled={loadingStore}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn"
                disabled={loadingStore}
                onClick={() => submitFormRef.current?.()}
                style={{
                  background:
                    "linear-gradient(90deg, #198754 0%, #146c43 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 600,
                  padding: "8px 16px",
                  fontSize: "1rem",
                  cursor: loadingStore ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {loadingStore ? (
                  <>
                    <SpinnerSmall /> Saving User...
                  </>
                ) : (
                  "Save User"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
