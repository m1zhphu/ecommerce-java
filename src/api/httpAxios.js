import axios from "axios";

export const BASE_URL = "http://localhost:8080/api"; // đổi theo backend của bạn

const httpAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpAxios;
