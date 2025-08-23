import * as React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-surface-base rounded-2xl shadow-soft p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 text-brand-muted"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
