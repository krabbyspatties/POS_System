import { useState } from "react";
import AlertMessage from "../../AlertMessage";
import DeleteCategoryForm from "../../forms/categories/DeleteCategoryForm";

const DeleteCategory = () => {
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
      <AlertMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={isVisible}
        onClose={handleCloseAlertMessage}
      />
      <div className="d-flex justify-content-center">
        <div className="col md-3">
          <DeleteCategoryForm
            onDeleteCategory={(message) =>
              handleShowAlertMessage(message, true, true)
            }
          />
        </div>
      </div>
    </>
  );
};

export default DeleteCategory;
