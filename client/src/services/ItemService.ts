import AxiosInstance from "../AxiosInstance"

const ItemService = {
  loadItems: async () => {
    return AxiosInstance.get("/loadItems")
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },

  getItem: async (itemId: number) => {
    return AxiosInstance.get(`/getItem/${itemId}`)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },

  storeItem: async (data: FormData) => {
    return AxiosInstance.post("/storeItem", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },

  updateItem: async (itemId: number, data: FormData) => {
    console.log("Updating item:", itemId)
    console.log("FormData entries:")
    for (const [key, value] of data.entries()) {
      console.log(key, value)
    }

    return AxiosInstance.post(`/updateItem/${itemId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("Update response:", response)
        return response
      })
      .catch((error) => {
        console.error("Update error:", error.response?.data || error.message)
        throw error
      })
  },

  destroyItem: async (ItemId: number) => {
    return AxiosInstance.delete(`/destroyItem/${ItemId}`)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
}

export default ItemService
