import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import type { Character, Weapon } from "@/lib/character";
import { type DerivedStats, fifth, half } from "@/lib/rules/derived";
import { skillValue } from "@/lib/sheet-skills";

const HEADERS = [
  "Broń",
  "Zwykły",
  "Wymagający",
  "Ekstrem.",
  "Obrażenia",
  "Zasięg",
  "Ataki",
  "Amunicja",
  "Zawodność",
];

function CombatStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-pulp-red/75 bg-card px-3 py-1">
      <span className="pulp-label text-xs text-pulp-red uppercase italic">
        {label}
      </span>
      <span className="font-display text-2xl font-bold">{value}</span>
    </div>
  );
}

export function CombatCard({
  character,
  derived,
}: {
  character: Character;
  derived: DerivedStats;
}) {
  // Every sheet starts with the unarmed row.
  const unarmed: Weapon = {
    name: "Nieuzbrojony",
    skill: skillValue(character, "walka-wrecz"),
    damage: "1K3 + MO",
    range: "–",
    attacks: "1",
    ammo: "–",
    malfunction: "–",
  };
  const weapons = [unarmed, ...character.weapons];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_auto]">
      <Card className="min-w-0">
        <SectionHeading className="px-4">Uzbrojenie</SectionHeading>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="pulp-label border-b-2 border-navy/50 px-2 pb-1 text-xs text-navy uppercase italic"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {weapons.map((weapon) => (
                <tr
                  key={weapon.name}
                  className="border-b border-dashed border-ink/25"
                >
                  <th scope="row" className="pulp-label px-2 py-1.5">
                    {weapon.name}
                  </th>
                  <td className="px-2">{weapon.skill}</td>
                  <td className="px-2">{half(weapon.skill)}</td>
                  <td className="px-2">{fifth(weapon.skill)}</td>
                  <td className="px-2">{weapon.damage}</td>
                  <td className="px-2">{weapon.range}</td>
                  <td className="px-2">{weapon.attacks}</td>
                  <td className="px-2">{weapon.ammo}</td>
                  <td className="px-2">{weapon.malfunction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card className="lg:w-52">
        <SectionHeading className="px-4">Walka</SectionHeading>
        <CardContent className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          <CombatStat label="Modyfikator Obrażeń" value={derived.damageBonus} />
          <CombatStat label="Krzepa" value={String(derived.build)} />
          <CombatStat
            label="Unik"
            value={String(skillValue(character, "unik"))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
