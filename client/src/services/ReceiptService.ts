import AxiosInstance from "../AxiosInstance";

console.log('ReceiptService initialized');

const ReceiptService = {
    saveReceipt: async () => {
        return AxiosInstance.get('/saveReceipt')
            .then((response) => response)
            .catch((error) => { throw error; });
    },
};

export default ReceiptService;
