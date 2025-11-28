import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CSRFToken: React.FC = () => {
  const [csrftoken, setCsrfToken] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const csrfToken = getCookie("csrftoken");

      if (!csrfToken) {
        try {
          await axios.get(`${API_URL}csrf/`, { withCredentials: true });
          setCsrfToken(getCookie("csrftoken"));
        } catch (error) {
          console.error("Error fetching CSRF token:", error);
        }
      } else {
        setCsrfToken(getCookie("csrftoken"));
      }
    };
    fetchCsrfToken();
  }, []);

  return (
    <input
      type="hidden"
      name="csrfmiddlewaretoken"
      value={csrftoken ?? ""}
    />
  );
};

export default CSRFToken;

