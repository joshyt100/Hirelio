import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Helper to get CSRF token from cookies
const getCSRFToken = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// General request function
const request = async (url: string, method: string, data: any) => {
  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error occurred");
  }
};

// Request function with CSRF token for protected endpoints
const resetRequest = async (url: string, method: string, data: any) => {
  try {
    const csrfToken = getCSRFToken();
  } catch (error: any) {
    throw new Error(error.message || "Failed to get CSRF token");
  }

  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken && { "X-CSRFToken": csrfToken }),
      },
      data,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error occurred");
  }
};

// Register new user
export const registerUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await request(`${API_URL}/register/`, "POST", userData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to register");
  }
};

// Login user
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await request(`${API_URL}/login/`, "POST", userData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to login");
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await request(`${API_URL}/logout/`, "POST", {});
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to logout");
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const response = await resetRequest(`${API_URL}/password_reset/`, "POST", { email });
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to reset password");
  }
};






