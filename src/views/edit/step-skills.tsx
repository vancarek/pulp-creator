import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { NumberInput } from "@/components/number-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sheetValue } from "@/lib/character-editor";
import { SKILLS } from "@/lib/rules/skills";

import type { StepProps } from "./editor-props";

const SPECIALIZED = SKILLS.filter((skill) => skill.specialization);

function AddSpecialization({ dispatch }: Pick<StepProps, "dispatch">) {
  const [baseId, setBaseId] = useState(SPECIALIZED[0].id);
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ type: "addSpecialization", baseId, name, value });
        setName("");
        setValue(0);
      }}
    >
      <Field>
        <FieldLabel>Umiejętność</FieldLabel>
        <Select
          value={baseId}
          onValueChange={(next) => next && setBaseId(next)}
          items={SPECIALIZED.map((s) => ({ value: s.id, label: s.name }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPECIALIZED.map((skill) => (
              <SelectItem key={skill.id} value={skill.id}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Specjalizacja</FieldLabel>
        <Input
          placeholder="np. Chemia"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Wartość</FieldLabel>
        <NumberInput value={value} onValueChange={setValue} />
      </Field>
      <Button type="submit" variant="outline" disabled={!name.trim()}>
        <PlusIcon data-icon="inline-start" weight="bold" />
        Dodaj
      </Button>
    </form>
  );
}

export function StepSkills({ state, dispatch }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Wpisz wartości umiejętności z karty Zewu. Pola zaczynają od wartości
        bazowej; zmieniaj tylko te, które się różnią.
      </p>
      <Card>
        <CardContent>
          <ul className="grid gap-x-5 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-2 py-1 even:bg-paper-deep/35"
              >
                <label
                  htmlFor={`skill-${skill.id}`}
                  className="pulp-label min-w-0 flex-1 leading-tight"
                >
                  {skill.name}
                </label>
                <NumberInput
                  id={`skill-${skill.id}`}
                  className="w-20 shrink-0"
                  value={sheetValue(state, skill.id)}
                  onValueChange={(value) =>
                    dispatch({ type: "skill", id: skill.id, value })
                  }
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="pulp-heading text-xl">Specjalizacje</h2>
          {state.extra.length > 0 && (
            <ul className="flex flex-col gap-1">
              {state.extra.map((skill) => (
                <li key={skill.id} className="flex items-center gap-2">
                  <label
                    htmlFor={`skill-${skill.id}`}
                    className="pulp-label min-w-0 flex-1"
                  >
                    {skill.label ?? skill.id}
                  </label>
                  <NumberInput
                    id={`skill-${skill.id}`}
                    className="w-20 shrink-0"
                    value={skill.value}
                    onValueChange={(value) =>
                      dispatch({ type: "skill", id: skill.id, value })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Usuń ${skill.label ?? skill.id}`}
                    onClick={() =>
                      dispatch({ type: "removeSpecialization", id: skill.id })
                    }
                  >
                    <TrashIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <AddSpecialization dispatch={dispatch} />
        </CardContent>
      </Card>
    </div>
  );
}
