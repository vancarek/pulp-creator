import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ValueBox } from "@/components/value-box";
import type { Character } from "@/lib/character";
import { sheetSkills } from "@/lib/sheet-skills";
import { cn } from "@/lib/utils";

export function SkillsCard({ character }: { character: Character }) {
  return (
    <Card>
      <SectionHeading className="px-4">Umiejętności</SectionHeading>
      <CardContent>
        <ul className="gap-x-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {sheetSkills(character).map((skill) => {
            const raised = skill.value > skill.base;
            return (
              <li
                key={skill.key}
                className="flex break-inside-avoid items-center gap-2 py-1 even:bg-paper-deep/35"
              >
                <span className="grid w-5 place-items-center">
                  {skill.improvable && (
                    <Checkbox
                      checked={skill.ticked}
                      readOnly
                      aria-label={`${skill.name}: do rozwoju`}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "pulp-label min-w-0 flex-1 text-[0.95rem] leading-tight",
                    raised ? "text-ink" : "text-ink/70",
                  )}
                >
                  {skill.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({skill.baseLabel})
                  </span>
                </span>
                <ValueBox
                  value={skill.value}
                  className={cn(raised && "border-navy/80")}
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
