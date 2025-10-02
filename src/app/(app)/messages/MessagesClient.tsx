'use client';

import { useState, useEffect } from 'react';
import MessageComposer from '@/components/MessageComposer';
import MessageItem from '@/components/MessageItem';
import { useThreadMessages } from '@/hooks/useThreadMessages';

interface Application {
  id: string;
  gig_title: string;
  employer_name: string;
  worker_name: string;
  status: string;
  created_at: string;
}

interface MessagesClientProps {
  userId: string;
}

export default function MessagesClient({ userId }: MessagesClientProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { items: messages, setItems: setMessages, loading: messagesLoading } = useThreadMessages(
    selectedAppId || undefined,
    userId
  );

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/with-messages');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        if (data.length > 0 && !selectedAppId) {
          setSelectedAppId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No conversations yet</h2>
        <p className="text-gray-500">
          Messages will appear here when you apply for jobs or receive applications.
        </p>
      </div>
    );
  }

  const selectedApp = applications.find(app => app.id === selectedAppId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedAppId === app.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="font-medium text-sm truncate">{app.gig_title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {app.employer_name} • {app.worker_name}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(app.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="lg:col-span-2 border rounded-lg flex flex-col">
        {selectedApp ? (
          <>
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold">{selectedApp.gig_title}</h3>
              <p className="text-sm text-gray-600">
                {selectedApp.employer_name} • {selectedApp.worker_name}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    msg={{
                      id: parseInt(message.id),
                      body: message.body,
                      sender: message.sender_id,
                      created_at: message.created_at,
                      profiles: null
                    }}
                    self={userId}
                  />
                ))
              )}
            </div>

            {/* Message Composer */}
            <div className="border-t p-4">
              <MessageComposer
                threadId={selectedAppId}
                userId={userId}
                onSent={handleMessageSent}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
