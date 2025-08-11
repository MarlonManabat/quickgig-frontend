'use client';

import React from 'react';
import { Wallet, AlertCircle, Check, X } from 'lucide-react';

interface TicketConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string;
  currentBalance: number;
  loading?: boolean;
}

const TicketConfirmModal: React.FC<TicketConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  currentBalance,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Ticket Usage
            </h3>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              You are about to {action}. This will consume 1 ticket from your wallet.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {currentBalance} ticket{currentBalance !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cost:</span>
                <span className="font-semibold text-red-600">-1 ticket</span>
              </div>
              <hr className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">After Action:</span>
                <span className="font-bold text-blue-600">
                  {currentBalance - 1} ticket{currentBalance - 1 !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {currentBalance - 1 <= 2 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  {currentBalance - 1 === 0 
                    ? "This will use your last ticket. Consider purchasing more tickets to continue using QuickGig.ph."
                    : `You'll have ${currentBalance - 1} ticket${currentBalance - 1 !== 1 ? 's' : ''} remaining. Consider purchasing more tickets soon.`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Processing...' : 'Confirm & Use Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmModal;

