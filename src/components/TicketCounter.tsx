'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TicketCounterProps {
  isAuthenticated: boolean;
}

export default function TicketCounter({ isAuthenticated }: TicketCounterProps) {
  const [ticketBalance, setTicketBalance] = useState<number>(3); // Default 3 free tickets
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTicketBalance();
    }
  }, [isAuthenticated]);

  const fetchTicketBalance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tickets/balance');
      if (response.ok) {
        const data = await response.json();
        setTicketBalance(data.balance || 3);
      }
    } catch (error) {
      console.error('Failed to fetch ticket balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
        <span className="text-lg">🎫</span>
        <span className="font-medium">
          {isLoading ? '...' : ticketBalance}
        </span>
        <span className="text-xs">tickets</span>
      </div>
      {ticketBalance <= 1 && (
        <Link 
          href="/tickets/buy" 
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Buy more
        </Link>
      )}
    </div>
  );
}
