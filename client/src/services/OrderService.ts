import AxiosInstance from "../AxiosInstance";

const OrderServices = {
    loadOrders: async  () => {
        return AxiosInstance.get('/loadOrder')
        .then((response) => response)
        .catch((error) => {throw error;})
    },
    createOrders: async (formData: any) => {
        console.log("Creating order with data: ", formData);
        return AxiosInstance.post('/createOrder', formData)
        .then((response) => response)
        .catch((error) => {throw error;})
    },
};
    

export default OrderServices;