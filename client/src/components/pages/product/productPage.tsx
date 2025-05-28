import { useState } from "react";
import ProductsTable from "./product";
import MainLayout from "../../layout/MainLayout";

const ProductPage = () => {
  const [refreshItems, setRefreshItems] = useState(false);

  const content = (
    <>
      <ProductsTable refreshItems={refreshItems} />
    </>
  );

  return <MainLayout content={content} />;
};

export default ProductPage;
