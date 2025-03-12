import axios from "axios";
import { getCookie } from "../utils/csrfUtils";

const API_URL = "http://127.0.0.1:8000/api";

// Register new user
export const registerUser = async (userData: { email: string; password: string }) => {
  //console.log('token', getCookie('csrftoken'));
  //console.log('full cookies', document.cookie);
  try {
    const response = await axios.post(`${API_URL}/register/`, userData, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken'),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to register");
  }
};

// Login user
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, userData, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie('csrftoken'),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to login");
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout/`, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to logout");
  }
};




// Reset password
// export const resetPassword = async (email: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/password_reset/`, { email }, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.error || "Failed to reset password");
//   }
// };
//
//

// Reset password function
//
//
export const resetPassword = async (email: string) => {
  try {
    const csrfToken = getCookie('csrftoken');

    if (!csrfToken) {
      throw new Error("CSRF token not found. Please refresh the page.");
    }

    const response = await axios.post(
      `${API_URL}/password_reset/`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Add CSRF token here
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.error || "Failed to reset password");
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

