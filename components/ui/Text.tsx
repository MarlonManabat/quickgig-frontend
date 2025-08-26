import { cn } from "@utils/cn";
import React from "react";

export const H1 = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    {...p}
    className={cn(
      "font-heading text-3xl md:text-4xl tracking-tight",
      p.className,
    )}
  />
);

export const H2 = (p: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...p}
    className={cn(
      "font-heading text-2xl md:text-3xl tracking-tight",
      p.className,
    )}
  />
);

export const P = (p: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    {...p}
    className={cn("text-base md:text-lg leading-relaxed", p.className)}
  />
);
