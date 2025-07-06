import axios from "axios";
const apiURL = import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.REACT_APP_API_URL;

export const getUserById = async (uId) => {
  try {
    // The backend route expects uId in the body, but for fetching self-data,
    // it's better if the backend uses the JWT.
    // However, the current frontend action `fetchData` in Action.jsx passes userId.
    // For now, just fixing the typo. Backend logic will be adjusted later.
    let res = await axios.post(`${apiURL}/api/user/single-user`, { uId }); // Fixed typo
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updatePersonalInformationFetch = async (userData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/edit-user`, userData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderByUser = async (uId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/order-by-user`, { uId });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (formData) => {
  try {
    let res = await axios.post(`${apiURL}/api/user/change-password`, formData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
