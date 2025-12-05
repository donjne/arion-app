'use client';

import { useQuery } from '@tanstack/react-query';
import { getTokenPrices } from '@/lib/api';
import { formatUsd } from '@/lib/utils';
import Image from 'next/image';

export function Header() {
  const { data: prices } = useQuery({
    queryKey: ['token-prices'],
    queryFn: getTokenPrices,
    refetchInterval: 60000, // Refetch every minute
  });

  const zecPrice = prices?.find(p => p.identifier.includes('ZEC'));
  const ethPrice = prices?.find(p => p.identifier.includes('ETH'));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-arion-rim/50 bg-arion-body/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/arion-logo.png"
                alt="Arion Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-arion-gold">
              ARION
            </h1>
          </div>

          {/* Price Ticker */}
          <div className="hidden md:flex items-center gap-6">
            {zecPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">ZEC</span>
                <span className="text-arion-text font-semibold">
                  {formatUsd(zecPrice.price_usd)}
                </span>
              </div>
            )}
            {ethPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">ETH</span>
                <span className="text-arion-text font-semibold">
                  {formatUsd(ethPrice.price_usd)}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Price Ticker */}
          <div className="flex md:hidden flex-col items-end gap-1">
            {zecPrice && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">ZEC</span>
                <span className="text-arion-text font-semibold">
                  {formatUsd(zecPrice.price_usd)}
                </span>
              </div>
            )}
            {ethPrice && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">ETH</span>
                <span className="text-arion-text font-semibold">
                  {formatUsd(ethPrice.price_usd)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}