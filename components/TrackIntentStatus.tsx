'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIntentStatus, handleApiError } from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Copy,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { copyToClipboard, truncateAddress } from '@/lib/utils';

export function TrackIntentStatus() {
  const [intentId, setIntentId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: status, isLoading, error, refetch } = useQuery({
    queryKey: ['intent-status', searchId],
    queryFn: () => getIntentStatus(searchId),
    enabled: !!searchId,
    refetchInterval: (query) => {
      // Auto-refetch every 10s if not completed/failed
      const data = query.state.data;
      if (!data) return false;
      if (data.status === 'Completed' || data.status === 'Failed' || data.status === 'Active') return false;
      return 10000;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (intentId.trim()) {
      setSearchId(intentId.trim());
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusIcon = (statusText: string) => {
    switch (statusText) {
      case 'Completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'Active':
        return <CheckCircle className="w-6 h-6 text-arion-gold" />;
      default:
        return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card title="Track Intent Status">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter Intent ID"
              value={intentId}
              onChange={(e) => setIntentId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" isLoading={isLoading}>
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300">
                {handleApiError(error)}
              </p>
            </div>
          )}
        </form>
      </Card>

      {isLoading && (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-arion-gold animate-spin" />
          </div>
        </Card>
      )}

      {status && !isLoading && (
        <Card>
          <div className="space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-arion-rim">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.status)}
                <div>
                  <h3 className="text-xl font-cinzel font-bold text-arion-gold">
                    {status.status}
                  </h3>
                  {status.message && (
                    <p className="text-sm text-gray-400 mt-1">{status.message}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => refetch()}
                className="text-arion-gold hover:text-arion-particle transition-colors"
                title="Refresh status"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Intent Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
                <label className="text-xs text-gray-400 block mb-2">Intent ID</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-arion-text break-all">
                    {truncateAddress(status.intent_id, 12)}
                  </code>
                  <button
                    onClick={() => handleCopy(status.intent_id, 'intent')}
                    className="text-arion-gold hover:text-arion-particle transition-colors"
                  >
                    {copiedField === 'intent' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
                <label className="text-xs text-gray-400 block mb-2">Position ID</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-arion-text break-all">
                    {truncateAddress(status.position_id, 12)}
                  </code>
                  <button
                    onClick={() => handleCopy(status.position_id, 'position')}
                    className="text-arion-gold hover:text-arion-particle transition-colors"
                  >
                    {copiedField === 'position' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Deposit Address (if pending) */}
            {status.deposit_address && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-300 mb-2">
                      Send {status.amount || ''} ZEC to:
                    </p>
                    <div className="bg-arion-body/50 rounded-lg p-3 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-white break-all font-mono">
                          {status.deposit_address}
                        </code>
                        <button
                          onClick={() => handleCopy(status.deposit_address!, 'deposit')}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {copiedField === 'deposit' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            {status.next_steps && status.next_steps.length > 0 && (
              <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
                <h4 className="font-medium text-arion-text mb-3">Next Steps:</h4>
                <ol className="space-y-2">
                  {status.next_steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-arion-gold font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Instructions */}
            {status.instructions && !status.next_steps && (
              <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
                <p className="text-sm text-gray-300">{status.instructions}</p>
              </div>
            )}

            {/* Active Position Info */}
            {status.status === 'Active' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-300 mb-2">
                      Position Active & Earning Yield!
                    </p>
                    {status.amount_deposited && (
                      <p className="text-sm text-gray-300">
                        Amount Deposited: <span className="text-arion-gold">{status.amount_deposited} ETH</span>
                      </p>
                    )}
                    {status.withdraw && (
                      <p className="text-xs text-gray-400 mt-2">
                        To withdraw: Use the &quot;Withdraw Position&quot; tab with your intent ID
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            {status.note && (
              <div className="text-sm text-gray-400 italic">
                {status.note}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
