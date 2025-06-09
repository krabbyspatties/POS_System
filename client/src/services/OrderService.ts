import AxiosInstance from "../AxiosInstance";

const OrderServices = {
  loadOrders: async () => {
    return AxiosInstance.get('/loadOrder') 
      .then((response) => response)
      .catch((error) => { throw error; });
  },

  createOrders: async (formData: any) => {
    console.log("Creating order with data: ", formData);
    try {
      const response = await AxiosInstance.post('/createOrder', formData);
      return response;
    } catch (error: any) {
      if (error.response) {
        console.error("Validation errors from server:", error.response.data);
      } else {
        console.error("Error creating order:", error.message);
      }
      throw error;
    }
  },

  getOrderById: async (orderId: number | string) => {
    try {
      const response = await AxiosInstance.get(`/orders/${orderId}`);
      return response;
    } catch (error: any) {
      console.error("Error fetching order by ID:", error.message);
      throw error;
    }
  },
};

export default OrderServices;
