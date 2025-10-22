import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sr from 'date-fns/locale/sr'; // Srpski lokal

registerLocale('sr', sr);

interface EditExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newExpiry: string) => void;
  clientName: string;
  currentExpiry: string;
}

export function EditExpiryModal({
  isOpen,
  onClose,
  onUpdate,
  clientName,
  currentExpiry
}: EditExpiryModalProps) {
  const [membershipExpiry, setMembershipExpiry] = useState(new Date(currentExpiry));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(membershipExpiry.toISOString().split('T')[0]); // Čuva u yyyy-MM-dd za backend
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full text-white border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">Ažuriraj Članarinu</h2>
            <p className="text-sm text-gray-300 mt-1">{clientName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nova članarina
            </label>
            <DatePicker
              selected={membershipExpiry}
              onChange={(date: Date) => setMembershipExpiry(date)}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white cursor-pointer text-lg"
              dateFormat="dd.MM.yyyy"
              locale="sr"
              calendarClassName="bg-gray-800 text-white border border-gray-700"
              wrapperClassName="w-full"
            />
          </div>

          <div className="flex space-x-3 pt-6">
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
              Ažuriraj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
