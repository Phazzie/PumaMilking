import { useState } from 'react';
import { useReactTable, createColumnHelper, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { Player } from '../types';
import EditPlayerModal from './EditPlayerModal';
import WithdrawalsList from './WithdrawalsList';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface PlayerTableProps {
  players: Player[];
  title: string;
  subtitle: string;
  onPlayerUpdate: (updatedPlayer: Player) => void;
}

const getRowSeverity = (player: Player) => {
  const unreceived = player.withdrawals.filter(w => !w.received).length;
  const totalAmount = player.withdrawals
    .filter(w => !w.received)
    .reduce((sum, w) => sum + w.amount, 0);
    
  if (unreceived > 2) return 'high';
  if (unreceived > 1) return 'medium';
  if (unreceived === 1 && totalAmount > 1000) return 'medium';
  return 'none';
};

const getSeverityStyle = (severity: 'high' | 'medium' | 'none') => {
  switch (severity) {
    case 'high':
      return 'bg-red-50 hover:bg-red-100';
    case 'medium':
      return 'bg-orange-50 hover:bg-orange-100';
    default:
      return 'hover:bg-gray-50';
  }
};

const getWithdrawalInsight = (player: Player) => {
  const unreceived = player.withdrawals.filter(w => !w.received);
  const total = unreceived.reduce((sum, w) => sum + w.amount, 0);
  
  if (unreceived.length > 2) {
    return `${unreceived.length} pending withdrawals totaling $${total.toFixed(2)}... *prolonged silence*`;
  }
  if (unreceived.length === 0 && player.withdrawals.length > 0) {
    return "All withdrawals received. Do mark your calendar for this historic moment.";
  }
  return null;
};

const columnHelper = createColumnHelper<Player>();

export default function PlayerTable({ players, title, subtitle, onPlayerUpdate }: PlayerTableProps) {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <div className="flex items-center">
          <span>{info.getValue()}</span>
          {getWithdrawalInsight(info.row.original) && (
            <div className="ml-2 group relative">
              <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              <div className="hidden group-hover:block absolute z-10 w-72 p-2 mt-1 text-sm bg-gray-800 text-white rounded-md -left-1/2">
                {getWithdrawalInsight(info.row.original)}
              </div>
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('playerIdLast4', {
      header: 'Last 4 ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pulseplayEmail', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('casino', {
      header: 'Casino',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'withdrawals',
      header: () => (
        <div className="flex items-center space-x-1">
          <span>Withdrawals</span>
          <span className="text-xs text-gray-500 italic">(The Eternal Wait)</span>
        </div>
      ),
      cell: props => (
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpandedPlayer(
                expandedPlayer === props.row.original.id ? null : props.row.original.id
              )}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              {props.row.original.withdrawals.length === 0 ? (
                <span className="text-gray-500 italic">No withdrawals yet... *pointed silence*</span>
              ) : (
                <>
                  {props.row.original.withdrawals.length} withdrawal{props.row.original.withdrawals.length > 1 ? 's' : ''} 
                  {expandedPlayer === props.row.original.id ? 
                    ' (hide the evidence)' : 
                    ' (view the saga)'}
                </>
              )}
            </button>
          </div>
          {expandedPlayer === props.row.original.id && (
            <div className="mt-2">
              <WithdrawalsList withdrawals={props.row.original.withdrawals} />
            </div>
          )}
        </div>
      ),
    }),
  ];
  
  const finalColumns = [
    ...columns,
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingPlayer(props.row.original)}
            className="text-sm text-indigo-600 hover:text-indigo-900 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Edit player"
          >
            Edit
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: players,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 italic">{subtitle}</p>
      </div>
      
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sticky top-0 bg-white"
                    >
                      {header.isPlaceholder ? null : 
                        flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {players.length === 0 ? (
                <tr>
                  <td 
                    colSpan={finalColumns.length} 
                    className="px-3 py-4 text-sm text-gray-500 italic text-center"
                  >
                    No players found... *tumbleweed rolls by* ...yet.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => {
                  const severity = getRowSeverity(row.original);
                  return (
                    <tr 
                      key={row.id}
                      className={`${getSeverityStyle(severity)} transition-colors`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-3 py-4 text-sm text-gray-500"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingPlayer && (
        <EditPlayerModal
          isOpen={!!editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={(updatedPlayer) => {
            onPlayerUpdate(updatedPlayer);
            setEditingPlayer(null);
          }}
          player={editingPlayer}
        />
      )}
    </div>
  );
}