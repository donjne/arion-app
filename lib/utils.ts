import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZec(amount: string): string {
  const num = parseFloat(amount);
  return num.toFixed(8) + ' ZEC';
}

export function formatEth(amount: string): string {
  const num = parseFloat(amount);
  return num.toFixed(6) + ' ETH';
}

export function formatUsd(amount: string): string {
  const num = parseFloat(amount);
  return '$' + num.toFixed(2);
}

export function truncateAddress(address: string, chars = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}