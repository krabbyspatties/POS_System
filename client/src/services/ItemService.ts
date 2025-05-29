import AxiosInstance from "../AxiosInstance";

const ItemService = {
  loadItems: async () => {
    return AxiosInstance.get("/loadItems")
      .then((respose) => respose)
      .catch((error) => {
        throw error;
      });
  },
  storeItem: async (data: FormData) => {
    console.log('Payload (FormData):', data);  
  
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
    return AxiosInstance.put(`/updateItem/${ItemId}`, data)
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
