import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Player, Casino, AddPlayerFormData } from '../types';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: Player) => void;
}

const CASINOS: Casino[] = ['FanDuel', 'BETMGM', 'Soaring Eagle', 'Caesars'];

export default function AddPlayerModal({ isOpen, onClose, onAdd }: AddPlayerModalProps) {
  const [formData, setFormData] = useState<AddPlayerFormData>({
    name: '',
    playerIdLast4: '',
    pulseplayEmail: '',
    casino: 'FanDuel',
    isActive: true,
    source: ''
  });

  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.source.length > 10) {
      alert('Oh, look who thinks they\'re above character limits...');
      return;
    }

    try {
      const newPlayer: Player = {
        ...formData,
        id: crypto.randomUUID(),
        withdrawals: []
      };
      onAdd(newPlayer);
      setFormData({
        name: '',
        playerIdLast4: '',
        pulseplayEmail: '',
        casino: 'FanDuel',
        isActive: true,
        source: ''
      });
    } catch (err) {
      setError('The player tried to save, but something went wrong. Probably your fault. Just kidding...mostly.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Add New Player
                    <p className="text-sm text-gray-500 font-normal italic">
                      *pointed pause* ...another one for the collection
                    </p>
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                      <span className="text-xs text-gray-500 italic ml-1">
                        (let's hope it's spelled correctly this time)
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last 4 of Player ID
                      <span className="text-xs text-gray-500 italic ml-1">
                        (yes, just the last 4... *sigh*)
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.playerIdLast4}
                      onChange={e => setFormData(prev => ({ ...prev, playerIdLast4: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pulseplay Email
                    </label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.pulseplayEmail}
                      onChange={e => setFormData(prev => ({ ...prev, pulseplayEmail: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Casino
                      <span className="text-xs text-gray-500 italic ml-1">
                        (choose wisely... or don't)
                      </span>
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.casino}
                      onChange={e => setFormData(prev => ({ ...prev, casino: e.target.value as Casino }))}
                    >
                      {CASINOS.map(casino => (
                        <option key={casino} value={casino}>{casino}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Initial Status
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.isActive.toString()}
                      onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    >
                      <option value="true">Active (for now...)</option>
                      <option value="false">Inactive (saving time, I see)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source
                      <span className="text-xs text-gray-500 italic ml-1">
                        (10 chars max. No, really.)
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.source}
                      onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 italic">{error}</p>
                  )}

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Player (What could possibly go wrong?)
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}