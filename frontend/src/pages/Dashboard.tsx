import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientTable } from '../components/ClientTable';
import { AddClientModal } from '../components/AddClientModal';
import { PlusIcon, LogOutIcon } from 'lucide-react';
import * as clientAPI from '../api/clients';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  membershipExpiry: string;
  trainer: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dohvati klijente sa backend-a
  const fetchClients = async () => {
    try {
      const data = await clientAPI.getClients();
      // mapiramo _id iz MongoDB u id
      const mappedClients = data.map((c: any) => ({ ...c, id: c._id }));
      setClients(mappedClients);
    } catch (err) {
      console.error('Greška pri dohvatanju klijenata:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleAddClient = async (newClient: Omit<Client, 'id'>) => {
    try {
      const addedClient = await clientAPI.addClient(newClient);
      setClients(prev => [...prev, { ...addedClient, id: addedClient._id }]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Greška pri dodavanju klijenta:', err);
    }
  };

  const handleUpdateClient = async (clientId: string, newExpiry: string) => {
    try {
      const updatedClient = await clientAPI.updateClient(clientId, { membershipExpiry: newExpiry });
      setClients(prev =>
        prev.map(client => (client.id === clientId ? { ...updatedClient, id: updatedClient._id } : client))
      );
    } catch (err) {
      console.error('Greška pri ažuriranju klijenta:', err);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await clientAPI.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (err) {
      console.error('Greška pri brisanju klijenta:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img src="/logo.png" alt="Fit District Logo" className="w-40 h-20 object-contain" />
          <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition">
            <LogOutIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Klijenti</h2>
            <p className="text-gray-400 mt-1">Informacije o klijentima</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Dodaj Klijenta</span>
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700">
          <ClientTable
            clients={clients}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
          />
        </div>
      </main>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}
