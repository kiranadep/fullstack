import { jwtDecode } from "jwt-decode";

export const isTokenValid = ()=>{
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken = jwtDecode(token);
    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    return Date.now() < expiryTime;
}

export const saveToken = (token) =>{
    localStorage.setItem('authToken',token);
}

export const logOut = ()=>{
    localStorage.removeItem('authToken');
}

export const getToken = ()=>{
    return localStorage.getItem('authToken');
}