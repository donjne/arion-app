'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Tabs, type Tab } from '@/components/Tabs';
import { CreateIntentForm } from '@/components/CreateIntentForm';
import { TrackIntentStatus } from '@/components/TrackIntentStatus';
import { WithdrawPositionForm } from '@/components/WithdrawPositionForm';
import { ListIntents } from '@/components/ListIntents';
import { ListPositions } from '@/components/ListPositions';
import {
  PlusCircle,
  Search,
  ArrowDownCircle,
  List,
  Briefcase,
} from 'lucide-react';

const tabs: Tab[] = [
  {
    id: 'create',
    label: 'Create Intent',
    icon: <PlusCircle className="w-4 h-4" />,
  },
  {
    id: 'track',
    label: 'Track Status',
    icon: <Search className="w-4 h-4" />,
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    icon: <ArrowDownCircle className="w-4 h-4" />,
  },
  {
    id: 'intents',
    label: 'All Intents',
    icon: <List className="w-4 h-4" />,
  },
  {
    id: 'positions',
    label: 'All Positions',
    icon: <Briefcase className="w-4 h-4" />,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-arion-gold mb-6 float">
            Privacy-Preserving DeFi
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4">
            Earn yield on your ZCash privately with Arion
          </p>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Deposit ZEC, automatically swap to ETH via NEAR Intents, and earn yield on Aave.
            All while maintaining your privacy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="bg-arion-shadow/60 backdrop-blur-sm rounded-t-xl border-x border-t border-arion-rim">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="bg-arion-shadow/40 backdrop-blur-sm rounded-b-xl border border-arion-rim p-6 min-h-[600px]">
            {activeTab === 'create' && (
              <div className="space-y-8">
                <CreateIntentForm />
                <div className="border-t border-arion-rim pt-8">
                  <h3 className="text-xl font-cinzel font-semibold text-arion-gold mb-4 text-center">
                    Recent Intents
                  </h3>
                  <ListIntents />
                </div>
              </div>
            )}

            {activeTab === 'track' && <TrackIntentStatus />}

            {activeTab === 'withdraw' && (
              <div className="space-y-8">
                <WithdrawPositionForm />
                <div className="border-t border-arion-rim pt-8">
                  <h3 className="text-xl font-cinzel font-semibold text-arion-gold mb-4 text-center">
                    Active Positions
                  </h3>
                  <ListPositions />
                </div>
              </div>
            )}

            {activeTab === 'intents' && <ListIntents />}

            {activeTab === 'positions' && <ListPositions />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-arion-rim/30">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            Powered by{' '}
            <span className="text-arion-gold">ZCash</span> •{' '}
            <span className="text-arion-gold">NEAR Intents</span> •{' '}
            <span className="text-arion-gold">Aave</span>
          </p>
          <p className="text-xs">
            © 2024 Arion. Privacy-preserving DeFi protocol.
          </p>
        </div>
      </footer>
    </div>
  );
}