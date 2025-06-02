import AxiosInstance from "../AxiosInstance";

const ReceiptService = {
    saveReceipt: async  () => {
        return AxiosInstance.get('/saveReceipt')
        .then((response) => response)
        .catch((error) => {throw error;})
    },
}

export default ReceiptService;