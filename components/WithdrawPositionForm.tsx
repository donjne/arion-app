'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { withdrawPosition, handleApiError, type WithdrawRequest } from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { AlertTriangle, CheckCircle, Copy, ExternalLink, Info } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

export function WithdrawPositionForm() {
  const [positionId, setPositionId] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: WithdrawRequest }) =>
      withdrawPosition(id, data),
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      alert(handleApiError(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: positionId,
      data: { return_address: returnAddress },
    });
  };

  const handleCopy = async (text: string, field: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ──────────────────────────────────────────────────────────────
  // Success / Confirmation Screen
  // ──────────────────────────────────────────────────────────────
  if (result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-cinzel font-bold text-arion-gold mb-2">
            Withdrawal Initiated!
          </h3>
          <p className="text-gray-400">
            Your ETH is being swapped to ZEC via NEAR Intents
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
              <label className="text-xs text-gray-400 block mb-2">ETH Sent</label>
              <p className="text-lg text-arion-gold font-semibold">{result.eth_sent} ETH</p>
            </div>

            <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
              <label className="text-xs text-gray-400 block mb-2">Expected ZEC</label>
              <p className="text-lg text-arion-gold font-semibold">~{result.expected_zec} ZEC</p>
            </div>
          </div>

          {/* ETH Transaction */}
          <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
            <label className="text-sm text-gray-400 block mb-2">ETH Transaction</label>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-arion-text break-all text-sm font-mono">
                {result.eth_transaction}
              </code>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(result.eth_transaction, 'tx')}
                className="text-arion-gold hover:text-arion-particle transition-colors"
                title="Copy transaction hash"
              >
                {copiedField === 'tx' ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>

              {/* External link */}
              <a
                href={`https://basescan.org/tx/${result.eth_transaction}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-arion-gold hover:text-arion-particle transition-colors"
                title="View on Basescan"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* NEAR Deposit Address */}
          <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
            <label className="text-sm text-gray-400 block mb-2">NEAR Deposit Address</label>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-arion-text break-all text-sm font-mono">
                {result.near_deposit_address}
              </code>
              <button
                onClick={() => handleCopy(result.near_deposit_address, 'near')}
                className="text-arion-gold hover:text-arion-particle transition-colors"
                title="Copy address"
              >
                {copiedField === 'near' ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ZEC Recipient */}
          <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
            <label className="text-sm text-gray-400 block mb-2">ZEC Recipient</label>
            <p className="text-sm text-arion-text break-all font-mono">{result.recipient_zec_address}</p>
          </div>

          {/* Optional Instructions */}
          {result.instructions && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-300 mb-3">What Happens Next:</h4>
              <ol className="space-y-2">
                {result.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-300">
                    <span className="text-blue-400 font-medium">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            setResult(null);
            setPositionId('');
            setReturnAddress('');
          }}
          className="w-full mt-6"
        >
          Withdraw Another Position
        </Button>
      </Card>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Initial Form
  // ──────────────────────────────────────────────────────────────
  return (
    <Card title="Withdraw Position" className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Position ID or Intent ID"
          type="text"
          placeholder="Enter your position or intent ID"
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
          required
        />

        <div>
          <Input
            label="Return ZEC Address"
            type="text"
            placeholder="Inout your transparent Zcash address"
            value={returnAddress}
            onChange={(e) => setReturnAddress(e.target.value)}
            required={true}
          />
          <div className="flex items-start gap-2 mt-2 text-xs text-gray-400">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Please input your transparent Zcash address where you will receive the withdrawn ZEC.
            </p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-yellow-300 mb-2">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your position will be closed on Aave</li>
                <li>ETH will be swapped to ZEC via NEAR Intents</li>
                <li>ZEC will be sent to your transparent address</li>
                <li>This process may take a few minutes</li>
                <li>After receiving, shield your ZEC by sending to your u1... address</li>
              </ul>
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={mutation.isPending} className="w-full">
          Withdraw Position
        </Button>
      </form>
    </Card>
  );
}
