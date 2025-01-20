
const API_URL = "http://127.0.0.1:8000/api";
// any for unknown data type -->
const request = async (url: string, method: string, data: any) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error occured");
  }

  return response.json();

};

// register new user
export const registerUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await request(`${API_URL}/register/`, "POST", userData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to register");
  }
};
