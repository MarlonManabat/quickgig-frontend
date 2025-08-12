'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Clock, DollarSign, FileText, Check, XIcon, Mail, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { Bid } from '@/types';

interface BidListModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export default function BidListModal({ isOpen, onClose, jobId, jobTitle }: BidListModalProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchBids();
    }
  }, [isOpen, jobId]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/bids/list?jobId=${jobId}`);
      setBids(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bids');
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, status: 'Accepted' | 'Rejected') => {
    try {
      setActionLoading(bidId);
      await api.put(`/api/bids/${bidId}/status`, { status });
      
      // Update the bid status in the local state
      setBids(prevBids => 
        prevBids.map(bid => 
          bid._id === bidId ? { ...bid, status } : bid
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${status.toLowerCase()} bid`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proposals Received</h2>
            <p className="text-sm text-gray-600 mt-1">For: {jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading proposals...</p>
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Proposals Yet</h3>
              <p className="text-gray-600">No freelancers have submitted proposals for this job yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div key={bid._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Freelancer Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{bid.freelancer.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {bid.freelancer.email}
                          </span>
                          {bid.freelancer.phone && (
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {bid.freelancer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                        {bid.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(bid.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Proposed Price
                      </div>
                      <p className="text-lg font-semibold text-gray-900">₱{bid.price.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        Delivery Time
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {bid.expectedDeliveryTime} {bid.expectedDeliveryTime === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FileText className="h-4 w-4 mr-1" />
                        Status
                      </div>
                      <p className={`text-lg font-semibold ${
                        bid.status === 'Accepted' ? 'text-green-600' :
                        bid.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {bid.status}
                      </p>
                    </div>
                  </div>

                  {/* Proposal Text */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Proposal:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {bid.proposalText}
                    </p>
                  </div>

                  {/* Actions */}
                  {bid.status === 'Pending' && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleBidAction(bid._id, 'Rejected')}
                        disabled={actionLoading === bid._id}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {actionLoading === bid._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        ) : (
                          <XIcon className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={() => handleBidAction(bid._id, 'Accepted')}
                        disabled={actionLoading === bid._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {actionLoading === bid._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Accept
                      </button>
                    </div>
                  )}

                  {bid.status === 'Accepted' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-green-800 font-medium">
                          Proposal accepted! A chat room has been created for project communication.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

