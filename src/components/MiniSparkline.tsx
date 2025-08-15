'use client';
interface Props {
  data: number[];
  className?: string;
}
export default function MiniSparkline({ data, className = '' }: Props) {
  const w = 100;
  const h = 30;
  if (!data.length) {
    return <svg viewBox={`0 0 ${w} ${h}`} className={className} />;
  }
  const max = Math.max(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * w;
      const y = h - (d / (max || 1)) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const min = Math.min(...data);
  const minI = data.indexOf(min);
  const maxI = data.indexOf(max);
  const minX = (minI / (data.length - 1 || 1)) * w;
  const minY = h - (min / (max || 1)) * h;
  const maxX = (maxI / (data.length - 1 || 1)) * w;
  const maxY = h - (max / (max || 1)) * h;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        points={points}
      />
      <circle cx={minX} cy={minY} r="1.5" />
      <circle cx={maxX} cy={maxY} r="1.5" />
    </svg>
  );
}
