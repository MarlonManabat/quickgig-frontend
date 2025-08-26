import { cn } from "@utils/cn";
import React from "react";

export const Container = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...p} className={cn("mx-auto w-full max-w-[1200px] px-6", className)} />
);

export default Container;
