'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Wallet, Plus } from 'lucide-react';

interface TicketWarningProps {
  action: string;
  currentBalance: number;
  onClose?: () => void;
}

const TicketWarning: React.FC<TicketWarningProps> = ({ action, currentBalance, onClose }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Insufficient Tickets
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            You need at least 1 ticket to {action}. You currently have {currentBalance} ticket{currentBalance !== 1 ? 's' : ''}.
          </p>
          <div className="flex items-center space-x-3">
            <Link
              href="/buy-tickets"
              className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Buy Tickets
            </Link>
            <div className="flex items-center text-sm text-yellow-700">
              <Wallet className="w-4 h-4 mr-1" />
              1 ticket = ₱10
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-yellow-600 hover:text-yellow-800 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketWarning;

