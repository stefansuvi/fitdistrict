import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { Client } from '../pages/Dashboard';
import { EditExpiryModal } from './EditExpiryModal';

interface ClientTableProps {
  clients: Client[];
  onUpdateClient: (clientId: string, newExpiry: string) => void;
  onDeleteClient: (clientId: string) => void;
}

type MembershipStatus = 'Sve' | 'Aktivna' | 'Ističe uskoro' | 'Istekla';

export function ClientTable({ clients, onUpdateClient, onDeleteClient }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('Svi');
  const [statusFilter, setStatusFilter] = useState<MembershipStatus>('Sve');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-Latn-RS', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatus = (client: Client): MembershipStatus => {
    const expiryDate = new Date(client.membershipExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (expiryDate < today) return 'Istekla';
    if (daysUntilExpiry <= 7) return 'Ističe uskoro';
    return 'Aktivna';
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.phoneNumber.includes(searchTerm);

    const matchesTrainer = trainerFilter === 'Svi' || client.trainer === trainerFilter;
    const status = getStatus(client);
    const matchesStatus = statusFilter === 'Sve' || status === statusFilter;

    return matchesSearch && matchesTrainer && matchesStatus;
  });

  const handleUpdateExpiry = (newExpiry: string) => {
    if (editingClient) {
      onUpdateClient(editingClient.id, newExpiry);
      setEditingClient(null);
    }
  };

  return (
    <>
      {/* Filter Header */}
      <div className="bg-gray-800 sticky top-0 z-20 border-b border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži klijente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-2 sm:mt-0">
          <select
            value={trainerFilter}
            onChange={e => setTrainerFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Svi">Svi treneri</option>
            <option value="Marko">Marko</option>
            <option value="Nenad">Nenad</option>
            <option value="Aleksa">Aleksa</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as MembershipStatus)}
            className="px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Sve">Sve članarine</option>
            <option value="Aktivna">Aktivne</option>
            <option value="Ističe uskoro">Ističe uskoro</option>
            <option value="Istekla">Istekle</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        {filteredClients.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Nema klijenata</p>
        ) : (
          <div className="grid gap-4">
            {filteredClients.map(client => (
              <div key={client.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                
                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-indigo-400" />
                    <span className="text-white font-medium">{client.firstName} {client.lastName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{client.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-white" />
                    <span className="text-gray-300">{formatDate(client.membershipExpiry)}</span>
                  </div>
                  <div className="text-gray-300">Trener: {client.trainer}</div>
                </div>

                {/* Status + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    getStatus(client) === 'Aktivna' ? 'bg-green-100/20 text-green-400'
                    : getStatus(client) === 'Ističe uskoro' ? 'bg-yellow-100/20 text-yellow-400'
                    : 'bg-red-100/20 text-red-400'
                  }`}>{getStatus(client)}</span>
                  <button onClick={() => setEditingClient(client)} className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">Izmeni</button>
                  <button onClick={() => setDeletingClient(client)} className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm">Obriši</button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingClient && (
        <EditExpiryModal
          isOpen={true}
          onClose={() => setEditingClient(null)}
          onUpdate={handleUpdateExpiry}
          clientName={`${editingClient.firstName} ${editingClient.lastName}`}
          currentExpiry={editingClient.membershipExpiry}
        />
      )}

      {deletingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Da li želite da obrišete ovog klijenta?</h2>
            <p className="text-gray-300 mb-6">{deletingClient.firstName} {deletingClient.lastName}</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeletingClient(null)} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition">Otkaži</button>
              <button onClick={() => { onDeleteClient(deletingClient.id); setDeletingClient(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Obriši</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
