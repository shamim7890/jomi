// components/StatusBadge.tsx

interface StatusBadgeProps {
  label: string;
  colorClass: string;
}

export default function StatusBadge({ label, colorClass }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}