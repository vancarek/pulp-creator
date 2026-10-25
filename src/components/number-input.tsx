import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** A whole-number field with the numeric keypad on phones. */
export function NumberInput({
  value,
  onValueChange,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: number;
  onValueChange: (value: number) => void;
}) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      min={0}
      value={Number.isFinite(value) ? value : ""}
      onChange={(event) => onValueChange(event.target.valueAsNumber || 0)}
      onFocus={(event) => event.target.select()}
      className={cn(
        "text-center font-display text-xl font-bold tabular-nums",
        className,
      )}
      {...props}
    />
  );
}
