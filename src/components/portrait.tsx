import type { Character } from "@/lib/character";
import { cn } from "@/lib/utils";

/**
 * The character's portrait. Portrait files come from the data repository in
 * stage 2; until then, the initials on the sheet's poster stripes.
 */
export function Portrait({
  character,
  size,
}: {
  character: Character;
  size: "sm" | "lg";
}) {
  const initials = character.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border-2 border-navy font-logo text-navy",
        "bg-[repeating-linear-gradient(to_bottom,var(--paper)_0_6px,var(--paper-deep)_6px_12px)]",
        size === "lg"
          ? "h-44 w-36 rounded-lg text-5xl shadow-[4px_4px_0_var(--navy)]"
          : "h-20 w-16 rounded-md text-2xl",
      )}
    >
      {initials}
    </div>
  );
}
