import AxiosInstance from "../AxiosInstance";

const ItemService = {
  loadItems: async () => {
    return AxiosInstance.get("/loadItems")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  storeItem: async (data: FormData) => {
    return AxiosInstance.post("/storeItem", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  updateItem: async (ItemId: number, data: any) => {
    // Prepare FormData payload
    const formData = new FormData();

    formData.append("item_name", data.item_name);
    formData.append("item_description", data.item_description);
    formData.append("item_price", String(data.item_price));

    if (data.item_discount !== undefined && data.item_discount !== null) {
      formData.append("item_discount", String(data.item_discount));
    }

    formData.append("stock_level", data.stock_level);
    formData.append("category_id", String(data.category_id));

    // Only append item_image if it's a File (new upload)
    if (data.item_image instanceof File) {
      formData.append("item_image", data.item_image);
    }

    console.log("Payload being sent to API:", formData);

    return AxiosInstance.put(`/updateItem/${ItemId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  destroyItem: async (ItemId: number) => {
    return AxiosInstance.delete(`/destroyItem/${ItemId}`)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default ItemService;
