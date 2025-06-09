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

  const loadItems = () => {
    setLoadingItems(true);
    ItemService.loadItems()
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data.items);
        } else {
          console.error("Unexpected status error while loading items:", res.status);
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

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "stretch",
          marginTop: "2rem",
        }}
      >
        {/* Left: ItemAlert Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            minWidth: "320px",
            maxWidth: "380px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <h5 style={{ fontSize: "1.1rem", marginBottom: 16, fontWeight: 600 }}>🔔 Stock Alerts</h5>
          <ItemAlert lowStockItems={lowStockItems} loading={loadingItems} />
        </div>

        {/* Right: Items Table */}
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
