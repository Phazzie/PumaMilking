import { useState } from 'react';
import { Player } from './types';
import PlayerTable from './components/PlayerTable';
import AddPlayerModal from './components/AddPlayerModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast, ToastContainer } from './components/Toast';

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const { addToast, toasts } = useToast();

  const addPlayer = (player: Player) => {
    setPlayers([...players, { ...player, id: crypto.randomUUID() }]);
    setIsAddPlayerOpen(false);
    addToast('Maybe THIS time the magic will actually happen.....sigh');
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers(players.map(p => 
      p.id === updatedPlayer.id ? updatedPlayer : p
    ));
    addToast("Changes saved. Let's hope you don't have to edit this player again anytime soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Casino Player Management
            <span className="text-sm text-gray-500 ml-2 italic">
              (Because spreadsheets weren't painful enough...)
            </span>
          </h1>
          <button
            onClick={() => setIsAddPlayerOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Player
          </button>
        </div>

        <div className="space-y-8">
          <PlayerTable 
            players={players.filter(p => p.isActive)}
            title="Active Players"
            subtitle="Players who haven't ghosted us yet"
            onPlayerUpdate={updatePlayer}
          />
          <PlayerTable 
            players={players.filter(p => !p.isActive)}
            title="Inactive Players"
            subtitle="The ones who got away... *pointed pause* probably for the best"
            onPlayerUpdate={updatePlayer}
          />
        </div>

        <AddPlayerModal
          isOpen={isAddPlayerOpen}
          onClose={() => setIsAddPlayerOpen(false)}
          onAdd={addPlayer}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}
