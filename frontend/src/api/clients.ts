import axios from 'axios';
const API_URL = "https://fitdistrict-backend.onrender.com/api/clients";


export const getClients = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addClient = async (client: any) => {
  const res = await axios.post(API_URL, client);
  return res.data;
};

export const updateClient = async (id: string, updates: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updates);
  return res.data;
};

export const deleteClient = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
