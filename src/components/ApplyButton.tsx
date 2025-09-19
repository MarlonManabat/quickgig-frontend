"use client";

import type { ButtonHTMLAttributes } from "react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

type Props = NativeButtonProps & {
  href?: string;
  jobId?: string | number;
  jobTitle?: string;
};

function resolveHref(href: string) {
  try {
    return new URL(href, window.location.origin);
  } catch {
    return null;
  }
}

export default function ApplyButton({
  href = "/applications",
  jobId,
  jobTitle,
  disabled,
  className,
  "data-testid": dataTestId,
  ...rest
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isDisabled = Boolean(disabled) || pending;

  const navigate = useCallback(
    (destination: string) => {
      if (!destination) return;
      if (typeof window === "undefined") return;
      const resolved = resolveHref(destination);
      if (resolved && resolved.origin === window.location.origin) {
        router.push(`${resolved.pathname}${resolved.search}${resolved.hash}`);
        return;
      }
      window.location.assign(destination);
    },
    [router],
  );

  const onClick = useCallback(() => {
    if (isDisabled) return;
    startTransition(async () => {
      setError(null);
      let success = true;
      if (jobId != null) {
        try {
          const res = await fetch("/api/applications/record", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ jobId, title: jobTitle }),
          });
          if (!res.ok) {
            success = false;
          }
        } catch {
          success = false;
        }
      }
      if (!success) {
        setError("Could not record application. Please try again.");
        return;
      }
      navigate(href);
    });
  }, [href, isDisabled, jobId, jobTitle, navigate]);

  const classes = useMemo(() => {
    const base = "inline-flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white transition";
    const state = isDisabled ? "opacity-50" : "hover:bg-blue-600";
    return [base, state, className].filter(Boolean).join(" ");
  }, [className, isDisabled]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      data-testid={dataTestId ?? "apply-button"}
      aria-disabled={isDisabled ? true : undefined}
      className={classes}
      {...rest}
    >
      {pending ? "Applying…" : "Apply"}
      {error ? <span className="ml-2 text-xs opacity-80">({error})</span> : null}
    </button>
  );
}
