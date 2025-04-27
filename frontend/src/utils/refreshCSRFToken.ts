import axios from "axios";

export const refreshCsrfToken = async () => {
  await axios.get("http://127.0.0.1:8000/api/csrf/", {
    withCredentials: true,
  });
};

