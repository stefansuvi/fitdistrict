import axios from "axios";

const API_URL = const API_URL = "https://fitdistrict.onrender.com/api/auth";


interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data; // vraća token i korisničke informacije
};
