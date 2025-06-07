import AxiosInstance from "../AxiosInstance"

const feedbackServices = {
  loadFeedback: async () => {
    return AxiosInstance.get("/feedback/responses")
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  
  loadSummary: async () => {
    return AxiosInstance.get("/feedback/summary")
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
}

export default feedbackServices
