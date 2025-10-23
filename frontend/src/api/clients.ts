import axios from 'axios';
const API_URL = "https://fitdistrict.onrender.com/api/clients";

// Funkcija za uzimanje tokena iz LocalStorage-a
const getToken = () => localStorage.getItem("token");

export const getClients = async () => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.data;
};

export const addClient = async (client: any) => {
  const res = await axios.post(API_URL, client, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.data;
};

export const updateClient = async (id: string, updates: any) => {
  const res = await axios.put(`${API_URL}/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.data;
};

export const deleteClient = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.data;
};
