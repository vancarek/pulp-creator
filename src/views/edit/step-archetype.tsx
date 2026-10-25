import { DiceFiveIcon } from "@phosphor-icons/react";

import { NumberInput } from "@/components/number-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CharacteristicKey } from "@/lib/character";
import { rollCoreCharacteristic } from "@/lib/conversion";
import { ARCHETYPES, findArchetype } from "@/lib/rules/archetypes";
import { CHARACTERISTICS } from "@/lib/rules/characteristics";

import type { StepProps } from "./editor-props";

const nameOf = (key: CharacteristicKey) =>
  CHARACTERISTICS.find((c) => c.key === key)?.name ?? key;

export function StepArchetype({ state, dispatch }: StepProps) {
  const { character } = state;
  const archetype = findArchetype(character.archetypeId);
  const core = character.coreCharacteristic;

  function pickArchetype(id: string) {
    const next = findArchetype(id);
    const keepCore = core !== null && next?.coreOptions.includes(core);
    dispatch({
      type: "field",
      patch: {
        archetypeId: id,
        coreCharacteristic: keepCore ? core : (next?.coreOptions[0] ?? null),
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Archetyp określa, jakim bohaterem pulpowym jest postać. Jego cecha
        główna w Pulp wynosi (1K6+13)×5, czyli od 70 do 95.
      </p>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Archetyp</FieldLabel>
            <Select
              value={character.archetypeId}
              onValueChange={(id) => id && pickArchetype(id)}
              items={ARCHETYPES.map((a) => ({ value: a.id, label: a.name }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz archetyp" />
              </SelectTrigger>
              <SelectContent>
                {ARCHETYPES.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              Nazwy robocze, do sprawdzenia z podręcznikiem.
            </FieldDescription>
          </Field>
          <Field disabled={!archetype}>
            <FieldLabel>Cecha główna</FieldLabel>
            <Select
              value={core}
              disabled={!archetype}
              onValueChange={(key) =>
                key &&
                dispatch({ type: "field", patch: { coreCharacteristic: key } })
              }
              items={(archetype?.coreOptions ?? []).map((key) => ({
                value: key,
                label: `${key} (${nameOf(key)})`,
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Najpierw archetyp" />
              </SelectTrigger>
              <SelectContent>
                {(archetype?.coreOptions ?? []).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key} ({nameOf(key)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>
      {core && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Field>
              <FieldLabel>
                {core} w Pulp (na karcie Zewu: {state.original[core]})
              </FieldLabel>
              <div className="flex gap-2">
                <NumberInput
                  className="w-28"
                  value={character.characteristics[core]}
                  onValueChange={(value) =>
                    dispatch({ type: "characteristic", key: core, value })
                  }
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    dispatch({
                      type: "characteristic",
                      key: core,
                      value: rollCoreCharacteristic(),
                    })
                  }
                >
                  <DiceFiveIcon data-icon="inline-start" weight="bold" />
                  Rzuć 1K6+13
                </Button>
              </div>
              <FieldDescription>
                Rzuć albo wpisz wynik rzutu przy stole. Zmiana cechy może
                wpłynąć na PW, Ruch i Krzepę.
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
