import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

export type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const getPassiveAggressivePrefix = (type: ToastType) => {
  if (type === 'success') {
    return [
      "How unexpectedly competent...",
      "Against all statistical probability...",
      "In a moment of rare clarity...",
      "Well, this is... different...",
      "Mark the calendar, it actually worked..."
    ][Math.floor(Math.random() * 5)];
  }
  return [
    "As the prophecy foretold...",
    "History repeats itself, darling...",
    "Maintaining our track record...",
    "Some patterns never change...",
    "True to form..."
  ][Math.floor(Math.random() * 5)];
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    const prefix = getPassiveAggressivePrefix(type);
    setToasts((prev: Toast[]) => [...prev, { 
      id, 
      message: `${prefix} ${message}`, 
      type 
    }]);
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
          enter="toast-enter toast-enter-active"
          enterFrom="toast-enter"
          enterTo="toast-enter-active"
          leave="toast-exit toast-exit-active"
          leaveFrom="toast-exit"
          leaveTo="toast-exit-active"
        >
          <div 
            className={`
              max-w-sm w-full backdrop-blur-sm bg-white/90 shadow-lg rounded-lg 
              pointer-events-auto ring-1 
              ${toast.type === 'success' ? 
                'ring-indigo-500/30 shadow-indigo-500/10' : 
                'ring-red-500/30 shadow-red-500/10'}
              animate-subtleJudgment hover:scale-[1.02] transition-all duration-300
            `}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-1 w-0">
                  <p className={`
                    text-sm font-medium italic
                    ${toast.type === 'success' ? 'text-indigo-900/90' : 'text-red-900/90'}
                  `}>
                    {toast.message}
                    <span className="text-xs text-gray-500/80 block mt-1 font-light">
                      {toast.type === 'success' ? 
                        "(Let's not get too excited...)" :
                        "(Some things never change...)"}
                    </span>
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