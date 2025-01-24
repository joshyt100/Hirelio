import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const CSRFToken: React.FC = () => {
  const [csrftoken, setCsrfToken] = useState<string | null>(null)

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
      try {
        await axios.get(`${API_URL}/csrf/`, { withCredentials: true });
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    fetchCsrfToken();
    setCsrfToken(getCookie('csrftoken'));
  }, []);

  return (
    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken ?? ""
    } />
  );
};

export default CSRFToken;
