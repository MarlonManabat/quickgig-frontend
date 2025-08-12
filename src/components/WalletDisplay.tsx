'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { WalletInfo } from '@/types';

const WalletDisplay: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWalletInfo();
    }
  }, [isAuthenticated, user]);

  const fetchWalletInfo = async () => {
    try {
      setLoading(true);
      const response = await api('/wallet', { auth: true });
      setWalletInfo(response.data?.data || response.data);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const ticketBalance = walletInfo?.ticketBalance ?? user.ticketBalance ?? 0;

  return (
    <div className="flex items-center space-x-2">
      {/* Wallet Balance Display */}
      <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
        <Wallet className="w-4 h-4 text-blue-600 mr-2" />
        <span className="text-sm font-medium text-blue-800">
          {loading ? '...' : ticketBalance}
        </span>
        <span className="text-xs text-blue-600 ml-1">
          ticket{ticketBalance !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Buy Tickets Button */}
      <Link
        href="/buy-tickets"
        className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        title="Buy Tickets"
      >
        <Plus className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Buy</span>
      </Link>
    </div>
  );
};

export default WalletDisplay;

