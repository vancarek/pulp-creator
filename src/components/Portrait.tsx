import type { Character } from '../model/character'

/** Portret postaci. Pliki portretów dojdą w etapie 2 z repo z danymi; do tego czasu inicjały. */
export function Portrait({ character, size }: { character: Character; size: 'small' | 'large' }) {
  const initials = character.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <div className={`portrait portrait-${size}`} aria-hidden="true">
      <span>{initials}</span>
    </div>
  )
}
