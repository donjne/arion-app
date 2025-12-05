'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createIntent, handleApiError } from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { AlertCircle, CheckCircle, Copy, Info } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface FormData {
  amount: string;
  protocol: string;
  return_address: string;
}

export function CreateIntentForm() {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    protocol: 'aave',
    return_address: '',
  });
  const [result, setResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createIntent,
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      alert(handleApiError(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform to match backend expectations
    const payload = {
      amount: formData.amount,
      protocol: formData.protocol,
      source_address: formData.return_address, // Use return address as source for now
      return_address: formData.return_address, // This is stored as user_zcash_address in backend
    };
    
    mutation.mutate(payload);
  };

  const handleCopy = async (text: string, field: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-cinzel font-bold text-arion-gold mb-2">
            Intent Created!
          </h3>
          <p className="text-gray-400">
            Your deposit address will be generated shortly
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
            <label className="text-sm text-gray-400 block mb-2">Intent ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-arion-text break-all text-sm">
                {result.intent_id}
              </code>
              <button
                onClick={() => handleCopy(result.intent_id, 'intent')}
                className="text-arion-gold hover:text-arion-particle transition-colors"
              >
                {copiedField === 'intent' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-arion-body/50 rounded-lg p-4 border border-arion-rim">
            <label className="text-sm text-gray-400 block mb-2">Position ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-arion-text break-all text-sm">
                {result.position_id}
              </code>
              <button
                onClick={() => handleCopy(result.position_id, 'position')}
                className="text-arion-gold hover:text-arion-particle transition-colors"
              >
                {copiedField === 'position' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">Next Steps</p>
                <p className="text-sm text-gray-300">
                  Check the intent status in the &quot;Track Intent&quot; tab to get your deposit address.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            setResult(null);
            setFormData({
              amount: '',
              protocol: 'aave',
              return_address: '',
            });
          }}
          className="w-full mt-6"
        >
          Create Another Intent
        </Button>
      </Card>
    );
  }

  return (
    <Card title="Create New Intent" className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Amount (ZEC)"
          type="text"
          placeholder="0.001"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-arion-text mb-2">
            Protocol
          </label>
          <select
            value={formData.protocol}
            onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
            className="w-full px-4 py-3 bg-arion-shadow border border-arion-rim rounded-lg text-white focus:outline-none focus:border-arion-gold transition-colors duration-200"
            required
          >
            <option value="aave">Aave</option>
          </select>
        </div>

        <div>
          <Input
            label="Your ZEC Address (Transparent)"
            type="text"
            placeholder="t1..."
            value={formData.return_address}
            onChange={(e) => setFormData({ ...formData, return_address: e.target.value })}
            required
          />
          <div className="flex items-start gap-2 mt-2 text-xs text-gray-400">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              This address will be used to send you ZEC when you withdraw. 
              Make sure you have access to this address.
            </p>
          </div>
        </div>

        <div className="bg-arion-body/50 border border-arion-rim/50 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-arion-gold shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-arion-text mb-1">Important:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use transparent ZEC addresses (starting with t1)</li>
                <li>Minimum deposit: 0.001 ZEC</li>
                <li>You&apos;ll receive a NEAR deposit address after creation</li>
                <li>Keep your Intent ID safe - you&apos;ll need it to track and withdraw</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={mutation.isPending}
          className="w-full"
        >
          Create Intent
        </Button>
      </form>
    </Card>
  );
}
