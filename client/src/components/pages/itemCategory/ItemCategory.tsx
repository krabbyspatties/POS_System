import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import AlertMessage from "../../AlertMessage";
import CategoryTable from "../../table/itemCategory/ItemCategoryTable";
import AddCategoryForm from "../../forms/categories/AddCategoriesform";

const CategoriesPage = () => {
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
  };

  const handleCloseAlertMessage = () => {
    setMessage("");
    setIsSuccess(false);
    setIsVisible(false);
  };
  const content = (
    <>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div>
          <AddCategoryForm
            onCategoryAdded={(message) => {
              handleShowAlertMessage(message, true, true);
              setRefreshCategory(!refreshCategory);
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
        <AlertMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={isVisible}
        onClose={handleCloseAlertMessage}
      />
          <CategoryTable refreshCategory={refreshCategory} />
        </div>
      </div>
    </>
  );

  return <MainLayout content={content} />;
};

export default CategoriesPage;
