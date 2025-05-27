import { useState } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemsTable from "../../table/item/ItemTable";
import MainLayout from "../../layout/MainLayout";
import AddItemModal from "../../modals/item/AddItemModal";
import EditItemModal from "../../modals/item/EditItemModal";
import DeleteItemModal from "../../modals/item/DeleteItemModal";

const ItemsPage = () => {
  const [refreshItems, setRefreshItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Items | null>(null);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);

  const handleOpenEditItemModal = (item: Items) => {
    setSelectedItem(item);
    setOpenEditItemModal(true);
  };

  const handleCloseEditItemModal = () => {
    setSelectedItem(null);
    setOpenEditItemModal(false);
  };

  const handleOpenDeleteItemModal = (item: Items) => {
    setSelectedItem(item);
    setOpenDeleteItemModal(true);
  };

  const handleCloseDeleteItemModal = () => {
    setSelectedItem(null);
    setOpenDeleteItemModal(false);
  };

  const content = (
    <>
      {openAddItemModal && (
        <AddItemModal
          showModal={true}
          onRefreshItems={() => setRefreshItems(!refreshItems)}
          onClose={() => setOpenAddItemModal(false)}
        />
      )}
      {openEditItemModal && (
        <EditItemModal
          showModal={true}
          item={selectedItem}
          onRefreshItems={() => setRefreshItems(!refreshItems)}
          onClose={handleCloseEditItemModal}
        />
      )}
      <DeleteItemModal
        showModal={openDeleteItemModal}
        item={selectedItem}
        onRefreshItems={() => setRefreshItems(!refreshItems)}
        onClose={handleCloseDeleteItemModal}
      />
      <div className="d-flex justify-content-end mt-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenAddItemModal(true)}
        >
          Add Item
        </button>
      </div>
      <ItemsTable
        refreshItems={refreshItems}
        onEditItem={handleOpenEditItemModal}
        onDeleteItem={handleOpenDeleteItemModal}
      />
    </>
  );

  return <MainLayout content={content} />;
};

export default ItemsPage;
