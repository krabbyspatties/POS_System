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

  updateUser: async (userId: number, data: FormData) => {
    console.log('Updating user:', userId);
    console.log('FormData entries:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    return AxiosInstance.post(`/updateUser/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log('Update response:', response);
        return response;
      })
      .catch((error) => {
        console.error('Update error:', error.response?.data || error.message);
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