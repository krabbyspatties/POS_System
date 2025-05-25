import type { Users } from "../../../interfaces/Users";
import AlertMessage from "../../AlertMessage";
import EditUserForm from "../../forms/users/EditUserForm";
import SpinnerSmall from "../../SpinnerSmall";
import { useRef, useState } from "react";

interface EditUserModalProps {
    showModal: boolean;
    user: Users | null;
    onClose: () => void;
    onRefreshUsers: (refresh: boolean) => void;
}

const EditUserModal = ({showModal, user, onClose, onRefreshUsers}: EditUserModalProps) => {
    
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loadingStore, setLoadingStore] = useState<boolean>(false);
  const [refreshUsers, setRefreshUsers] = useState<boolean>(false);

  const submitFormRef = useRef<(() => void) | null>(null);

  const handleShowAlertMessage = (msg: string, success: boolean, visible: boolean) => {
    setMessage(msg);
    setIsSuccess(success);
    setIsVisible(visible);
  };

  const handleCloseAlertMessage = () => {
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
              <h1 className="modal-title fs-5">Add User</h1>
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
              <EditUserForm
                user={user}
                setSubmitForm={submitFormRef}
                setLoadingUpdate={setLoadingStore}
                onUserUpdated={(message: string) => {
                  handleShowAlertMessage(message, true, true);
                  setRefreshUsers(!refreshUsers);
                  onRefreshUsers(!refreshUsers);
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
  )
}

export default EditUserModal