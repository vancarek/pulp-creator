import { describe, expect, it } from "vitest";

import { findPortrait, PORTRAITS, takenPortraits } from "@/lib/portraits";

describe("portraits", () => {
  it("offers six placeholders with unique ids", () => {
    expect(PORTRAITS).toHaveLength(6);
    expect(new Set(PORTRAITS.map((p) => p.id)).size).toBe(6);
    expect(findPortrait("portret-2")?.label).toBe("Portret 2");
    expect(findPortrait(null)).toBeUndefined();
  });

  it("marks portraits taken by other characters only", () => {
    const taken = takenPortraits(
      [
        { slug: "jan", name: "Jan", portrait: "portret-1" },
        { slug: "ewa", name: "Ewa", portrait: "portret-2" },
        { slug: "olek", name: "Olek", portrait: null },
      ],
      "jan",
    );
    expect([...taken]).toEqual([["portret-2", "Ewa"]]);
  });
});
