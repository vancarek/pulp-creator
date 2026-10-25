import { NumberInput } from "@/components/number-input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CHARACTERISTICS } from "@/lib/rules/characteristics";

import type { StepProps } from "./editor-props";

const TEXT_FIELDS = [
  ["name", "Imię Bohatera"],
  ["player", "Gracz"],
  ["occupation", "Profesja"],
  ["sex", "Płeć"],
  ["residence", "Miejsce zamieszkania"],
  ["birthplace", "Miejsce urodzenia"],
] as const;

export function StepSheet({ state, dispatch }: StepProps) {
  const { character } = state;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Przepisz dane z papierowej karty Zewu Cthulhu. Archetyp i zmiany z Pulp
        dojdą w kolejnych krokach.
      </p>
      <Card>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {TEXT_FIELDS.map(([field, label]) => (
            <Field key={field}>
              <FieldLabel>{label}</FieldLabel>
              <Input
                value={character[field]}
                onChange={(event) =>
                  dispatch({
                    type: "field",
                    patch: { [field]: event.target.value },
                  })
                }
              />
            </Field>
          ))}
          <Field>
            <FieldLabel>Wiek</FieldLabel>
            <NumberInput
              value={character.age}
              onValueChange={(age) =>
                dispatch({ type: "field", patch: { age } })
              }
            />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHARACTERISTICS.map(({ key, name }) => (
            <Field key={key}>
              <FieldLabel>
                {key} <span className="font-normal">({name})</span>
              </FieldLabel>
              <NumberInput
                value={character.characteristics[key]}
                onValueChange={(value) =>
                  dispatch({ type: "characteristic", key, value })
                }
              />
            </Field>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field>
            <FieldLabel>Obecne PW</FieldLabel>
            <NumberInput
              placeholder="maks."
              value={character.currentHp ?? Number.NaN}
              onValueChange={(currentHp) =>
                dispatch({ type: "field", patch: { currentHp } })
              }
            />
          </Field>
          <Field>
            <FieldLabel>Poczytalność</FieldLabel>
            <NumberInput
              placeholder="= MOC"
              value={character.currentSanity ?? Number.NaN}
              onValueChange={(currentSanity) =>
                dispatch({ type: "field", patch: { currentSanity } })
              }
            />
          </Field>
          <Field>
            <FieldLabel>Obecne PM</FieldLabel>
            <NumberInput
              placeholder="maks."
              value={character.currentMp ?? Number.NaN}
              onValueChange={(currentMp) =>
                dispatch({ type: "field", patch: { currentMp } })
              }
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
