import { ReactNode } from "react";

interface Props {
  message: string;
  onConfirm: () => void;
  children: ReactNode;
}

export default function ConfirmDialog({ message, onConfirm, children }: Props) {
  const handleClick = () => {
    if (confirm(message)) onConfirm();
  };
  return (
    <button onClick={handleClick} data-testid="confirm-dialog-action">
      {children}
    </button>
  );
}
