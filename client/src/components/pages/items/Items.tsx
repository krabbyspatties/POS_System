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

  // Modal Handlers
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

  // Low stock threshold
  const lowStockItems = items.filter((item) => item.item_quantity < 100);

  const content = (
    <>
      {openAddItemModal && (
        <AddItemModal
          showModal={true}
          onRefreshItems={() => setRefreshItems((prev) => !prev)}
          onClose={() => setOpenAddItemModal(false)}
        />
      )}
      {openEditItemModal && (
        <EditItemModal
          showModal={true}
          item={selectedItem}
          onRefreshItems={() => setRefreshItems((prev) => !prev)}
          onClose={handleCloseEditItemModal}
        />
      )}
      <DeleteItemModal
        showModal={openDeleteItemModal}
        item={selectedItem}
        onRefreshItems={() => setRefreshItems((prev) => !prev)}
        onClose={handleCloseDeleteItemModal}
      />

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div>
          <div
            className="alert"
            style={{
              backgroundColor: "#e3f2fd",
              border: "1px solid #90caf9",
              color: "#1565c0",
              borderRadius: "4px",
              padding: "16px",
              fontFamily: "monospace",
              fontSize: "15px",
              marginBottom: "0",
              marginTop: "1rem",
              minWidth: "260px",
              maxWidth: "320px",
            }}
            role="alert"
          >
            <strong>Logs:</strong>
            <div style={{ marginTop: "8px" }}>
              <ItemAlert lowStockItems={lowStockItems} loading={loadingItems} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
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
