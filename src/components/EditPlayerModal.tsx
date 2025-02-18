import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Player, Casino, AddPlayerFormData } from '../types';

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Player) => void;
  player: Player;
}

const CASINOS: Casino[] = ['FanDuel', 'BETMGM', 'Soaring Eagle', 'Caesars'];

const getEditingInsight = (player: Player) => {
  const pendingWithdrawals = player.withdrawals.filter(w => !w.received).length;
  if (pendingWithdrawals > 2) return "I see we're collecting pending withdrawals like they're rare Pokémon cards...";
  if (!player.isActive) return "Back to edit an inactive player? *prolonged silence* ...Interesting choice.";
  if (player.withdrawals.length === 0) return "No withdrawals yet. At least there's nothing to be disappointed about.";
  return "Let's see what creative ways we can find to track this one's journey...";
};

export default function EditPlayerModal({ isOpen, onClose, onSave, player }: EditPlayerModalProps) {
  const [formData, setFormData] = useState<AddPlayerFormData>({
    name: player.name,
    playerIdLast4: player.playerIdLast4,
    pulseplayEmail: player.pulseplayEmail,
    casino: player.casino,
    isActive: player.isActive,
    source: player.source
  });

  const [fieldsTouched, setFieldsTouched] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setFormData({
      name: player.name,
      playerIdLast4: player.playerIdLast4,
      pulseplayEmail: player.pulseplayEmail,
      casino: player.casino,
      isActive: player.isActive,
      source: player.source
    });
    setFieldsTouched(new Set());
  }, [player]);

  const handleFieldChange = (field: keyof AddPlayerFormData, value: string | boolean) => {
    setFieldsTouched(prev => new Set([...prev, field]));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFieldMessage = (field: keyof AddPlayerFormData) => {
    if (!fieldsTouched.has(field)) return null;
    
    switch (field) {
      case 'name':
        return formData.name === player.name 
          ? "Well, at least that hasn't changed... yet."
          : "Third time's the charm with the spelling, perhaps?";
      case 'playerIdLast4':
        return "Still just the last 4... still just as cryptic.";
      case 'pulseplayEmail':
        return formData.pulseplayEmail === player.pulseplayEmail 
          ? "Holding onto that email like it's a lucky charm."
          : "Oh, a new email? How... optimistic.";
      case 'source':
        if (formData.source.length > 8) return "Approaching that 10-character limit with remarkable determination.";
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.source.length > 10) {
      setError('Still trying to break the 10-character limit? *extended pause* ...How ambitious.');
      return;
    }

    try {
      const updatedPlayer: Player = {
        ...player,
        ...formData
      };
      onSave(updatedPlayer);
      onClose();
    } catch (err) {
      setError('The changes tried to save, but something went wrong. Mercury must still be in retrograde.');
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
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
              <div className="flex justify-between items-start">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Edit Player
                  <p className="text-sm text-gray-500 font-normal italic">
                    {getEditingInsight(player)}
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
                      {fieldsTouched.has('name') && getFieldMessage('name')}
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.name}
                    onChange={e => handleFieldChange('name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last 4 of Player ID
                    <span className="text-xs text-gray-500 italic ml-1">
                      {fieldsTouched.has('playerIdLast4') && getFieldMessage('playerIdLast4')}
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.playerIdLast4}
                    onChange={e => handleFieldChange('playerIdLast4', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pulseplay Email
                    <span className="text-xs text-gray-500 italic ml-1">
                      {fieldsTouched.has('pulseplayEmail') && getFieldMessage('pulseplayEmail')}
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.pulseplayEmail}
                    onChange={e => handleFieldChange('pulseplayEmail', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Casino
                    <span className="text-xs text-gray-500 italic ml-1">
                      (Changing casinos like changing luck...)
                    </span>
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.casino}
                    onChange={e => handleFieldChange('casino', e.target.value as Casino)}
                  >
                    {CASINOS.map(casino => (
                      <option key={casino} value={casino}>
                        {casino} {casino === player.casino ? '(Current... for now)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                    <span className="text-xs text-gray-500 italic ml-1">
                      (The moment of truth...)
                    </span>
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.isActive.toString()}
                    onChange={e => handleFieldChange('isActive', e.target.value === 'true')}
                  >
                    <option value="true">Active (Maintaining that optimism, I see)</option>
                    <option value="false">Inactive (Finally accepting reality?)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Source
                    <span className="text-xs text-gray-500 italic ml-1">
                      {fieldsTouched.has('source') && getFieldMessage('source')}
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.source}
                    onChange={e => handleFieldChange('source', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 italic">
                    Still 10 characters max. Some things never change...
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                      <p className="ml-3 text-sm text-red-700 italic">{error}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Changes (Let's see if they stick this time)
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}