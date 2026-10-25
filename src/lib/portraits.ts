// The portraits a character can pick from. Placeholders until the keeper's
// AI-generated images land in the data repository's portraits/ (stage 2);
// each placeholder is a poster-striped silhouette in its own colour pair.

export type PortraitDef = {
  id: string;
  label: string;
  /** Placeholder colours: stripes and silhouette. */
  stripes: string;
  figure: string;
  /** Placeholder silhouette shape. */
  shape: "fedora" | "cloche" | "cap" | "bob" | "bald" | "veil";
};

export const PORTRAITS: PortraitDef[] = [
  {
    id: "portret-1",
    label: "Portret 1",
    stripes: "#e8916b",
    figure: "#41437e",
    shape: "fedora",
  },
  {
    id: "portret-2",
    label: "Portret 2",
    stripes: "#d04f5a",
    figure: "#231f20",
    shape: "cloche",
  },
  {
    id: "portret-3",
    label: "Portret 3",
    stripes: "#8e8fb8",
    figure: "#231f20",
    shape: "cap",
  },
  {
    id: "portret-4",
    label: "Portret 4",
    stripes: "#e5c9a1",
    figure: "#d04f5a",
    shape: "bob",
  },
  {
    id: "portret-5",
    label: "Portret 5",
    stripes: "#41437e",
    figure: "#f7dbb4",
    shape: "bald",
  },
  {
    id: "portret-6",
    label: "Portret 6",
    stripes: "#c97c5d",
    figure: "#41437e",
    shape: "veil",
  },
];

export const findPortrait = (id: string | null) =>
  PORTRAITS.find((portrait) => portrait.id === id);

/** Which portraits other characters already have, by portrait id → character name. */
export function takenPortraits(
  characters: { slug: string; name: string; portrait: string | null }[],
  slug: string,
): Map<string, string> {
  return new Map(
    characters
      .filter((c) => c.slug !== slug && c.portrait !== null)
      .map((c) => [c.portrait as string, c.name]),
  );
}
