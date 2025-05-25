import AxiosInstance from "../AxiosInstance";

const ItemCategoryServices = {
    loadCategories: async  () => {
        return AxiosInstance.get('/loadCategory')
        .then((response) => response)
        .catch((error) => {throw error;})
    },
    getCategories: async(category_id: number) => {
        return AxiosInstance.get(`/getCategory/${category_id}`)
        .then((response) => response)
        .catch((error) => {throw error;});
    },
    
    storeCategories : async(data:any) => {
        return AxiosInstance.post('/storeCategory', data)
        .then((response) => response)
        .catch((error) => {throw error;})
    },
    updateCategories: async(category_id: number, data: any)=>{
        return AxiosInstance.put(`/updateCategory/${category_id}`, data).then((response) => response).catch((error) => {throw error}) 
    },
    destroyCategories: async(category_id: number) => {
        return AxiosInstance.delete(`/destroyCategory/${category_id}`)
          .then((response) => response)
          .catch((error) => { throw error; });
    }
};
    

export default ItemCategoryServices;