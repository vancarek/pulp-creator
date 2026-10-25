import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A section title as on the sheet: striped rules either side of red outlined caps. */
export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="pulp-rule flex-1" />
      <Tag className="pulp-heading text-2xl leading-none sm:text-3xl">
        {children}
      </Tag>
      <span aria-hidden="true" className="pulp-rule flex-1" />
    </div>
  );
}
