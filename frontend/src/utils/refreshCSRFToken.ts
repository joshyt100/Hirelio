import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const refreshCsrfToken = async () => {
  await axios.get(`${API_URL}csrf/`, {
    withCredentials: true,
  });
};

