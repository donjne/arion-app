'use client';

import { useQuery } from '@tanstack/react-query';
import { listPositions, handleApiError } from '@/lib/api';
import { Card } from './ui/Card';
import { Loader2, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { truncateAddress, copyToClipboard, formatEth } from '@/lib/utils';
import { useState } from 'react';

export function ListPositions() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: positions, isLoading, error } = useQuery({
    queryKey: ['positions'],
    queryFn: listPositions,
    refetchInterval: 30000,
  });

  const handleCopy = async (id: string) => {
    await copyToClipboard(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-arion-gold animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-red-400">{handleApiError(error)}</p>
        </div>
      </Card>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-400">No positions found</p>
          <p className="text-sm text-gray-500 mt-2">
            Your active positions will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`All Positions (${positions.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-arion-rim">
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Position ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Amount Deposited
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Protocol
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-arion-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position: any) => (
              <tr key={position.id} className="border-b border-arion-rim/50 hover:bg-arion-body/30">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-gray-300 font-mono">
                      {truncateAddress(position.id, 8)}
                    </code>
                    <button
                      onClick={() => handleCopy(position.id)}
                      className="text-arion-gold hover:text-arion-particle transition-colors"
                      title="Copy Position ID"
                    >
                      {copiedId === position.id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-arion-gold font-medium">
                    {formatEth(position.amount_deposited)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      position.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : position.status === 'Withdrawing'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {position.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-400 capitalize">{position.protocol}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  {position.status === 'Active' && (
                    <a
                      href={`#withdraw-${position.id}`}
                      className="inline-flex items-center gap-1 text-sm text-arion-gold hover:text-arion-particle transition-colors"
                      title="Withdraw this position"
                    >
                      Withdraw <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}