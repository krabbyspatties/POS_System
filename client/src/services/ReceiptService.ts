import AxiosInstance from "../AxiosInstance";

const ReceiptService = {
  saveReceipt: async (formData: FormData) => {
    return AxiosInstance.post("/saveReceipt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default ReceiptService;
