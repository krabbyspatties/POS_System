import { useState, useEffect } from "react";
import type { Items } from "../../../interfaces/Item/Items";
import ItemsTable from "../../table/item/ItemTable";
import MainLayout from "../../layout/MainLayout";
import AddItemModal from "../../modals/item/AddItemModal";
import EditItemModal from "../../modals/item/EditItemModal";
import DeleteItemModal from "../../modals/item/DeleteItemModal";
import ItemAlert from "../../forms/alert/ItemAlert";
import ItemService from "../../../services/ItemService";
import ErrorHandler from "../../handler/ErrorHandler";

const ItemsPage = () => {
  const [refreshItems, setRefreshItems] = useState(false);
  const [items, setItems] = useState<Items[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [selectedItem, setSelectedItem] = useState<Items | null>(null);
  const [openAddItemModal, setOpenAddItemModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);

  // Load items here
  const loadItems = () => {
    setLoadingItems(true);
    ItemService.loadItems()
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data.items);
        } else {
          console.error(
            "Unexpected status error while loading items: ",
            res.status
          );
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setLoadingItems(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, [refreshItems]);

  // Handlers for modals (same as before)
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

  // Define low stock threshold, e.g., less than 5
  const lowStockItems = items.filter((item) => item.item_quantity < 100);

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

      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenAddItemModal(true)}
        >
          Add Item
        </button>
      </div>
      <div className="d-flex mt-3" style={{ gap: "20px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ItemAlert lowStockItems={lowStockItems} loading={loadingItems} />
        </div>
        <div style={{ flex: 2, minWidth: 0 }}>
          <ItemsTable
            loadingItems={loadingItems}
            items={items}
            onEditItem={handleOpenEditItemModal}
            onDeleteItem={handleOpenDeleteItemModal}
          />
        </div>
      </div>
    </>
  );

  return <MainLayout content={content} />;
};

export default ItemsPage;
