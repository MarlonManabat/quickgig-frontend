import * as React from "react";

interface ToastProps {
  message: string;
  type?: "info" | "success" | "error";
}

export default function Toast({ message, type = "info" }: ToastProps) {
  const styles: Record<NonNullable<ToastProps["type"]>, string> = {
    info: "bg-brand-info",
    success: "bg-brand-success",
    error: "bg-brand-danger",
  };
  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-2xl text-white shadow-soft ${styles[type]}`}
    >
      {message}
    </div>
  );
}
