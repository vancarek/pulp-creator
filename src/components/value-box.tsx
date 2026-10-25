import { cn } from "@/lib/utils";

/** A value's box on the sheet: just the full value. */
export function ValueBox({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-md border-2 border-pulp-red/75 bg-card font-display font-bold tabular-nums",
        size === "lg" ? "h-14 w-16 text-3xl" : "h-10 w-12 text-xl",
        className,
      )}
    >
      {value}
    </span>
  );
}
