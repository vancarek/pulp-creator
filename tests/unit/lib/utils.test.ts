import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges conditional classes, later Tailwind classes winning", () => {
    const hidden = false as boolean;
    expect(cn("px-2 py-1", hidden && "hidden", "px-4")).toBe("py-1 px-4");
  });
});
