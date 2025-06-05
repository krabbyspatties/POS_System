import { useState } from "react";
import AddCategoryForm from "./AddCategoriesform";
import AlertMessage from "../../AlertMessage";
import CategoryTable from "../../table/itemCategory/ItemCategoryTable";

interface CategoryContentProps {
  onCategoryAdded?: (message: string) => void;
  refreshTrigger?: boolean;
}

const CategoryContent = ({
  onCategoryAdded,
  refreshTrigger,
}: CategoryContentProps) => {
  const [refreshCategory, setRefreshCategory] = useState(false);

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

    if (isSuccess) {
      // Notify parent if callback provided
      if (onCategoryAdded) {
        onCategoryAdded(message);
      }
      // Toggle refresh to reload CategoryTable
      setRefreshCategory((prev) => !prev);
    }
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div>
        <AddCategoryForm
          onCategoryAdded={(msg) => handleShowAlertMessage(msg, true, true)}
        />
      </div>

      <div style={{ flex: 1 }}>
        <AlertMessage
          message={message}
          isSuccess={isSuccess}
          isVisible={isVisible}
          onClose={handleCloseAlertMessage}
        />
        <CategoryTable
          refreshCategory={refreshCategory || refreshTrigger || false}
        />
      </div>
    </div>
  );
};

export default CategoryContent;
