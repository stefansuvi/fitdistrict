import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Client } from '../pages/Dashboard';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id'>) => void;
}

export function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipExpiry, setMembershipExpiry] = useState<Date | null>(null);
  const [trainer, setTrainer] = useState('Marko');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membershipExpiry) return;

    // ✅ Fix timezone — postavi podne kako UTC ne bi promenio datum
    const fixedDate = new Date(membershipExpiry);
    fixedDate.setHours(12, 0, 0, 0);

    onAdd({
      firstName,
      lastName,
      phoneNumber,
      membershipExpiry: fixedDate, // ✅ šaljemo pravi Date
      trainer,
    });

    // Reset form
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setMembershipExpiry(null);
    setTrainer('Marko');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 text-white">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Dodaj Novog Klijenta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ime</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              placeholder="Ime"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prezime</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              placeholder="Prezime"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Broj Telefona</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white"
              placeholder="+3816..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trener</label>
            <select
              value={trainer}
              onChange={e => setTrainer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="Marko">Marko</option>
              <option value="Nenad">Nenad</option>
              <option value="Aleksa">Aleksa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Članarina traje do</label>
            <DatePicker
              selected={membershipExpiry}
              onChange={(date: Date) => setMembershipExpiry(date)}
              dateFormat="dd.MM.yyyy"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white cursor-pointer"
              placeholderText="Izaberi datum"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Poništi
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Dodaj Klijenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
