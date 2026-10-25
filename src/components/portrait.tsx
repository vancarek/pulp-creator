import type { Character } from "@/lib/character";
import { findPortrait, type PortraitDef } from "@/lib/portraits";
import { cn } from "@/lib/utils";

// Simple poster silhouettes standing in for the AI portraits.
const HEADWEAR: Record<PortraitDef["shape"], string> = {
  fedora: "M18 34h64v6H18zM30 18c4-6 36-6 40 0l4 16H26z",
  cloche: "M26 40c0-18 48-18 48 0v6H26z",
  cap: "M28 34c2-14 42-14 44 0zM60 34h22v5H60z",
  bob: "M28 56c-6-30 50-30 44 0l-4 8H32z",
  bald: "",
  veil: "M22 30c10-16 46-16 56 0l6 40H16z",
};

export function PortraitArt({
  portrait,
  className,
}: {
  portrait: PortraitDef;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 125"
      className={className}
      role="img"
      aria-label={portrait.label}
    >
      <defs>
        <pattern
          id={`stripes-${portrait.id}`}
          width="100"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="10" fill="var(--paper)" />
          <rect width="100" height="5" fill={portrait.stripes} opacity="0.55" />
        </pattern>
      </defs>
      <rect width="100" height="125" fill={`url(#stripes-${portrait.id})`} />
      <g fill={portrait.figure}>
        <ellipse cx="50" cy="52" rx="17" ry="20" />
        <path d="M43 68h14v10H43z" />
        <path d="M12 125c2-30 18-44 38-44s36 14 38 44z" />
        {HEADWEAR[portrait.shape] && <path d={HEADWEAR[portrait.shape]} />}
      </g>
    </svg>
  );
}

/** The character's portrait, or their initials until one is picked. */
export function Portrait({
  character,
  size,
}: {
  character: Character;
  size: "sm" | "lg";
}) {
  const portrait = findPortrait(character.portrait);
  const initials = character.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border-2 border-navy font-logo text-navy",
        "bg-[repeating-linear-gradient(to_bottom,var(--paper)_0_6px,var(--paper-deep)_6px_12px)]",
        size === "lg"
          ? "h-44 w-36 rounded-lg text-5xl shadow-[4px_4px_0_var(--navy)]"
          : "h-20 w-16 rounded-md text-2xl",
      )}
    >
      {portrait ? (
        <PortraitArt portrait={portrait} className="size-full" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
