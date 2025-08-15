'use client';
import { FC } from 'react';
import { Conversation } from '@/types/messages';

type Props = {
  convo: Conversation;
  onSelect: () => void;
};

export const InboxItem: FC<Props> = ({ convo, onSelect }) => {
  return (
    <div onClick={onSelect} className="p-2 border-b cursor-pointer">
      <div className="font-bold">{convo.title || 'Conversation'}</div>
      {convo.unread ? <span className="text-sm text-red-600">Unread</span> : null}
    </div>
  );
};
