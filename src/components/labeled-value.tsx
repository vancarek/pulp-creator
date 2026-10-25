import type { ReactNode } from "react";

/** A sheet line: small bold label, then the handwritten-in value. */
export function LabeledValue({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col border-b border-dashed border-ink/30 pb-1">
      <dt className="pulp-label text-xs text-navy uppercase">{label}</dt>
      <dd className="truncate">{children || "—"}</dd>
    </div>
  );
}
