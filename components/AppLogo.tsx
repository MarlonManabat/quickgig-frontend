import Image from "next/image";

export default function AppLogo({ size=28, className="" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src="/brand/quickgig-badge.png" alt="QuickGig" width={size} height={size} priority />
      <span className="hidden sm:inline font-semibold tracking-wide text-white">QuickGig.ph</span>
    </span>
  );
}

