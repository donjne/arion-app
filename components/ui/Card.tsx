'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div
      className={cn(
        'bg-arion-shadow/80 backdrop-blur-sm border border-arion-rim rounded-xl p-6',
        'shadow-xl hover:shadow-arion-gold/10 transition-all duration-300',
        className
      )}
    >
      {title && (
        <h3 className="text-xl font-cinzel font-semibold text-arion-gold mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}