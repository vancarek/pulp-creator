import { fifth, half } from "@/lib/rules/derived";
import { cn } from "@/lib/utils";

/** The Call of Cthulhu box: the full value, with its half above its fifth. */
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
        "inline-flex shrink-0 overflow-hidden rounded-md border-2 border-pulp-red/75 bg-card font-display font-bold tabular-nums",
        size === "lg" ? "h-14 w-[5.5rem]" : "h-10 w-[4.25rem]",
        className,
      )}
      aria-label={`${value}, połowa ${half(value)}, piąta część ${fifth(value)}`}
    >
      <span
        className={cn(
          "grid flex-1 place-items-center",
          size === "lg" ? "text-3xl" : "text-xl",
        )}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "grid grid-rows-2 border-l-2 border-pulp-red/75 text-muted-foreground",
          size === "lg" ? "w-8 text-base" : "w-6 text-xs",
        )}
      >
        <span className="grid place-items-center border-b-2 border-pulp-red/75">
          {half(value)}
        </span>
        <span className="grid place-items-center">{fifth(value)}</span>
      </span>
    </span>
  );
}
