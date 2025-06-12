import { useRef, useState } from "react";
import type { Users } from "../../../interfaces/User/Users";
import AlertMessage from "../../AlertMessage";
import DeleteUserForm from "../../forms/users/DeleteUserForm";
import SpinnerSmall from "../../SpinnerSmall";

interface DeleteUserModalProps {
  showModal: boolean;
  user: Users | null;
  onRefreshUsers: (refresh: boolean) => void;
  onClose: () => void;
}

const DeleteUserModal = ({
  showModal,
  user,
  onRefreshUsers,
  onClose,
}: DeleteUserModalProps) => {
  const submitFormRef = useRef<() => void | null>(null);

  const [refreshUsers, setRefreshUsers] = useState(false);
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
        <div
          className="modal-content"
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 24,
            boxShadow:
              "0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.05)",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: 48, color: "#dc3545", marginBottom: 12 }}
            aria-hidden="true"
          >
            &#9888;
          </div>
          <h3
            style={{ marginBottom: 20, fontWeight: "bold", color: "#dc3545" }}
          >
            Confirm Deletion
          </h3>

          <div className="mb-3">
            <AlertMessage
              message={message}
              isSuccess={isSuccess}
              isVisible={isVisible}
              onClose={handleCloseAlertMessage}
            />
          </div>

          <p style={{ fontSize: 16, marginBottom: 24 }}>
            Are you sure you want to delete this user?
          </p>

          <DeleteUserForm
            user={user}
            setSubmitForm={submitFormRef}
            setLoadingDestroy={setLoadingDestroy}
            onDeletedUser={(message) => {
              handleShowAlertMessage(message, true, true);
              const newRefresh = !refreshUsers;
              setRefreshUsers(newRefresh);
              onRefreshUsers(newRefresh);
              setTimeout(() => onClose(), 1500);
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
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

export default DeleteUserModal;
