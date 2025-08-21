import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef<() => void>();

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current && saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
