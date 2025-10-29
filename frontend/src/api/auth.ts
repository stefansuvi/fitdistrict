import axios from "axios";

// Standardized auth client to the admins login endpoint
const API_URL = "https://fitdistrict.onrender.com/api/admins";

export interface LoginData {
  username: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data; // { success, token, username }
};
