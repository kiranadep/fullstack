import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
    GET_PRODUCTS:'/auth/products',
    GET_PRODUCT: (id) => `/auth/products/${id}`,
    GET_CATEGORIES:'/auth/categories',
    GET_CATEGORY: (id) => `/auth/categories/${id}`,
}

export const API_BASE_URL = 'http://localhost:8080';


export const getHeaders = ()=>{
    return {
        'Authorization':`Bearer ${getToken()}`
    }
}