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
    <>
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Delete User</h1>
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
                Are you sure do you want to delete this user?
              </p>
              <DeleteUserForm
                user={user}
                setSubmitForm={submitFormRef}
                setLoadingDestroy={setLoadingDestroy}
                onDeletedUser={(message) => {
                  handleShowAlertMessage(message, true, true);
                  setRefreshUsers(!refreshUsers);
                  onRefreshUsers(refreshUsers);
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
                    <SpinnerSmall /> Deleting User...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUserModal;
