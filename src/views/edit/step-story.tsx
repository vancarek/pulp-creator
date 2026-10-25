import { PlusIcon, TrashIcon } from "@phosphor-icons/react";

import { NumberInput } from "@/components/number-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Character, Weapon } from "@/lib/character";

import type { StepProps } from "./editor-props";

const BACKSTORY: [keyof Character["backstory"], string][] = [
  ["description", "Opis postaci"],
  ["traits", "Przymioty"],
  ["ideology", "Ideologia/Przekonania"],
  ["injuries", "Urazy/Blizny"],
  ["significantPeople", "Ważne osoby"],
  ["phobias", "Fobie/Manie"],
  ["meaningfulLocations", "Znaczące miejsca"],
  ["arcaneTomes", "Tajemne księgi, zaklęcia i artefakty"],
  ["treasuredPossessions", "Rzeczy osobiste"],
  ["encounters", "Spotkania z dziwnymi istotami"],
];

const POSSESSIONS = [
  ["spendingLevel", "Poziom wydatków"],
  ["cash", "Gotówka"],
  ["assets", "Dobytek"],
] as const;

const WEAPON_TEXT: [keyof Omit<Weapon, "name" | "skill">, string][] = [
  ["damage", "Obrażenia"],
  ["range", "Zasięg"],
  ["attacks", "Ataki"],
  ["ammo", "Amunicja"],
  ["malfunction", "Zawodność"],
];

export function StepStory({ state, dispatch }: StepProps) {
  const { character } = state;
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {BACKSTORY.map(([field, label]) => (
            <Field key={field}>
              <FieldLabel>{label}</FieldLabel>
              <Textarea
                value={character.backstory[field]}
                onChange={(event) =>
                  dispatch({
                    type: "backstory",
                    field,
                    value: event.target.value,
                  })
                }
              />
            </Field>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="pulp-heading text-xl">Uzbrojenie</h2>
          {character.weapons.map((weapon, index) => (
            <fieldset
              key={index}
              className="grid grid-cols-2 gap-2 border-b border-dashed border-ink/30 pb-3 sm:grid-cols-4 lg:grid-cols-8"
            >
              <legend className="sr-only">Broń {index + 1}</legend>
              <Field className="col-span-2">
                <FieldLabel>Broń</FieldLabel>
                <Input
                  value={weapon.name}
                  onChange={(event) =>
                    dispatch({
                      type: "weapon",
                      index,
                      patch: { name: event.target.value },
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Umiejętność</FieldLabel>
                <NumberInput
                  value={weapon.skill}
                  onValueChange={(skill) =>
                    dispatch({ type: "weapon", index, patch: { skill } })
                  }
                />
              </Field>
              {WEAPON_TEXT.map(([field, label]) => (
                <Field key={field}>
                  <FieldLabel>{label}</FieldLabel>
                  <Input
                    value={weapon[field]}
                    onChange={(event) =>
                      dispatch({
                        type: "weapon",
                        index,
                        patch: { [field]: event.target.value },
                      })
                    }
                  />
                </Field>
              ))}
              <Button
                variant="ghost"
                className="col-span-2 self-end sm:col-span-4 lg:col-span-8 lg:justify-self-end"
                onClick={() => dispatch({ type: "removeWeapon", index })}
              >
                <TrashIcon data-icon="inline-start" />
                Usuń broń
              </Button>
            </fieldset>
          ))}
          <Button
            variant="outline"
            className="self-start"
            onClick={() => dispatch({ type: "addWeapon" })}
          >
            <PlusIcon data-icon="inline-start" weight="bold" />
            Dodaj broń
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {POSSESSIONS.map(([field, label]) => (
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
          <Field className="md:col-span-2">
            <FieldLabel>Ekwipunek</FieldLabel>
            <Textarea
              value={character.equipment}
              onChange={(event) =>
                dispatch({
                  type: "field",
                  patch: { equipment: event.target.value },
                })
              }
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
