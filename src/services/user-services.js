import axios from "axios";
const API_URL = 'http://localhost:8080/api/user/';

export const register = async (user) => {
    const response = await axios.post(API_URL + 'register', user);
    return response.data;
};

export const login = async (user) => {
  const response = await axios.post(API_URL + 'login', user);
  return response.data;
};

export const logout = async () => {
  await axios.post(API_URL + 'logout');
};