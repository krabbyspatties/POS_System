import AxiosInstance from "../AxiosInstance";

const UserService = {
  loadUsers: async () => {
    return AxiosInstance.get("/loadUsers")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  storeUser: async (data: FormData) => {
    return AxiosInstance.post("/storeUser", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  updateUser: async (userId: number, data: any) => {
    return AxiosInstance.put(`/updateUser/${userId}`, data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  destroyUser: async (userId: number) => {
    return AxiosInstance.put(`/destroyUser/${userId}`)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default UserService;
