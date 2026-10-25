import { ArrowLeftIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { SectionHeading } from "@/components/section-heading";

/** A sub-view's top: back to the sheet, then the view's title. */
export function ViewHeader({
  backTo,
  backLabel,
  children,
}: {
  backTo: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        to={backTo}
        className="pulp-label inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-navy uppercase outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeftIcon weight="bold" className="size-5" />
        {backLabel}
      </Link>
      <SectionHeading as="h1">{children}</SectionHeading>
    </div>
  );
}
