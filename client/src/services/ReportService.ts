import AxiosInstance from "../AxiosInstance";

const ReportService = {
    getSalesReport: (params?: { start_date?: string; end_date?: string }) => {
      return AxiosInstance.get('/salesReport', { params });
    },
    getInventoryReport: () => {
      return AxiosInstance.get('/inventoryReport');
    }
  };
  
  export default ReportService;
  