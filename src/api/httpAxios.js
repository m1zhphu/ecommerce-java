import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

const httpAxios = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpAxios;
