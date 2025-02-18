import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Withdrawal, Casino } from '../types';
import { Switch } from '@headlessui/react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface WithdrawalsListProps {
  withdrawals: Withdrawal[];
}

interface AddWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (withdrawal: Omit<Withdrawal, 'id'>) => void;
  casinoName: Casino;
}

function WithdrawalStatusBadge({ received }: { received: boolean }) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${received ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
    `}>
      {received ? (
        <>
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          Received (miraculously)
        </>
      ) : (
        <>
          <ClockIcon className="w-4 h-4 mr-1" />
          Pending (*sigh*)
        </>
      )}
    </span>
  );
}

function AddWithdrawalModal({ isOpen, onClose, onAdd, casinoName }: AddWithdrawalModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalDate: '',
    received: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      casinoName,
      amount: parseFloat(formData.amount),
      withdrawalDate: formData.withdrawalDate,
      received: formData.received
    });
    setFormData({ amount: '', withdrawalDate: '', received: false });
    onClose();
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
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Add Withdrawal
                <p className="text-sm text-gray-500 italic">
                  *long, pointed pause* Let's see if this one actually arrives...
                </p>
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                    <span className="text-xs text-gray-500 italic ml-1">
                      (Dare to dream...)
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.amount}
                      onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Requested
                    <span className="text-xs text-gray-500 italic ml-1">
                      (Day 1 of the waiting game...)
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.withdrawalDate}
                    onChange={e => setFormData(prev => ({ ...prev, withdrawalDate: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-gray-900">Already Received?</span>
                    <span className="text-sm text-gray-500 italic">
                      (Let's not get our hopes up...)
                    </span>
                  </span>
                  <Switch
                    checked={formData.received}
                    onChange={received => setFormData(prev => ({ ...prev, received }))}
                    className={`${
                      formData.received ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Received status</span>
                    <span
                      className={`${
                        formData.received ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add Withdrawal (Fingers crossed... again)
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

export default function WithdrawalsList({ withdrawals }: WithdrawalsListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localWithdrawals, setLocalWithdrawals] = useState(withdrawals);

  const totalPending = localWithdrawals.filter(w => !w.received).reduce((sum, w) => sum + w.amount, 0);
  const totalReceived = localWithdrawals.filter(w => w.received).reduce((sum, w) => sum + w.amount, 0);

  const handleAddWithdrawal = (withdrawal: Omit<Withdrawal, 'id'>) => {
    const newWithdrawal = {
      ...withdrawal,
      id: crypto.randomUUID()
    };
    setLocalWithdrawals(prev => [...prev, newWithdrawal]);
  };

  const toggleReceived = (withdrawalId: string) => {
    setLocalWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? { ...w, received: !w.received }
          : w
      )
    );
  };

  return (
    <div>
      <div className="space-y-2">
        {localWithdrawals.map(withdrawal => (
          <div
            key={withdrawal.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                ${withdrawal.amount.toFixed(2)}
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(withdrawal.withdrawalDate).toLocaleDateString()}
                </span>
              </span>
              <WithdrawalStatusBadge received={withdrawal.received} />
            </div>
            <Switch
              checked={withdrawal.received}
              onChange={() => toggleReceived(withdrawal.id)}
              className={`${
                withdrawal.received ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Received status</span>
              <span
                className={`${
                  withdrawal.received ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>

      {localWithdrawals.length > 0 && (
        <div className="mt-4 text-sm">
          <div className="flex justify-between items-center text-gray-600">
            <span>Pending: <span className="font-medium text-yellow-600">${totalPending.toFixed(2)}</span></span>
            <span>Received: <span className="font-medium text-green-600">${totalReceived.toFixed(2)}</span></span>
          </div>
          <p className="text-xs text-gray-500 italic mt-1">
            {totalPending > totalReceived 
              ? "Ah yes, the eternal waiting game continues..."
              : "Well, well... looks like some things do work out eventually."}
          </p>
        </div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mt-4 text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
      >
        <span>Add Another Withdrawal</span>
        <span className="text-xs text-gray-500 italic ml-2">(Eternal optimist, aren't we?)</span>
      </button>

      <AddWithdrawalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWithdrawal}
        casinoName={localWithdrawals[0]?.casinoName || 'FanDuel' as Casino}
      />
    </div>
  );
}