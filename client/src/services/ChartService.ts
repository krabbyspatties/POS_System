import AxiosInstance from "../AxiosInstance";

const ChartService = {
    loadChart: async  () => {
        return AxiosInstance.get('/BestItem')
        .then((response) => response)
        .catch((error) => {throw error;})
    },
    loadTopSpenders: async () => {
        return AxiosInstance.get('/TopCustomers')
          .then((response) => response)
          .catch((error) => { throw error; });
      }
};


export default ChartService;