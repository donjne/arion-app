'use client';

import { useQuery } from '@tanstack/react-query';
import { listIntents, handleApiError } from '@/lib/api';
import { Card } from './ui/Card';
import { Loader2, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { truncateAddress, copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

export function ListIntents() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: intents, isLoading, error } = useQuery({
    queryKey: ['intents'],
    queryFn: listIntents,
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

  if (!intents || intents.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-400">No intents found</p>
          <p className="text-sm text-gray-500 mt-2">
            Create your first intent to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`All Intents (${intents.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-arion-rim">
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Intent ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-arion-text">
                Amount
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
            {intents.map((intent: any) => (
              <tr key={intent.id} className="border-b border-arion-rim/50 hover:bg-arion-body/30">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-gray-300 font-mono">
                      {truncateAddress(intent.id, 8)}
                    </code>
                    <button
                      onClick={() => handleCopy(intent.id)}
                      className="text-arion-gold hover:text-arion-particle transition-colors"
                      title="Copy Intent ID"
                    >
                      {copiedId === intent.id ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-arion-gold font-medium">
                    {intent.amount} ZEC
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      intent.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : intent.status === 'Failed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {intent.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-400 capitalize">{intent.protocol}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`#track-${intent.id}`}
                    className="inline-flex items-center gap-1 text-sm text-arion-gold hover:text-arion-particle transition-colors"
                    title="Track this intent"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}