import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

export type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
    }, 3000);
  };

  return { addToast, toasts };
}

interface ToastContainerProps {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map(toast => (
        <Transition
          key={toast.id}
          show={true}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ${toast.type === 'success' ? 'ring-indigo-500' : 'ring-red-500'}`}>
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-1 w-0">
                  <p className={`text-sm font-medium italic ${toast.type === 'success' ? 'text-indigo-900' : 'text-red-900'}`}>
                    {toast.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
}