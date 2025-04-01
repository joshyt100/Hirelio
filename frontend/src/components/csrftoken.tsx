import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";
//const API_URL = "https://ai-cover-letter-generator-i2xa.onrender.com/api";

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

  // component did mount for setting csrf token 
  // only fetches csrf token if not already set
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const csrfToken = getCookie('csrftoken');

      if (!csrfToken) {
        try {
          await axios.get(`${API_URL}/csrf/`, { withCredentials: true });
          setCsrfToken(getCookie('csrftoken'));

        } catch (error) {
          console.error("Error fetching CSRF token:", error);
        }
      }
      else {
        setCsrfToken(getCookie("csrftoken"));
      }
    };
    fetchCsrfToken();
  }, []);

  // returns hidden input for csrf token which is expected by django backend
  return (

    <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken ?? ""
    } />
  );
};

export default CSRFToken;
