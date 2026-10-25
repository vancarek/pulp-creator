import type { Character } from '../model/character'
import { CHARACTERISTICS } from '../rules/characteristics'
import { SKILLS, findSkill, skillBase } from '../rules/skills'
import { findArchetype } from '../rules/archetypes'
import { findTalent } from '../rules/talents'
import { derive, fifth, half } from '../rules/derived'
import { Portrait } from './Portrait'

interface SheetSkill {
  key: string
  name: string
  value: number
  improved: boolean
}

/** Pełna lista umiejętności na kartę: bazowe z wartościami postaci plus jej specjalizacje. */
function sheetSkills(ch: Character): SheetSkill[] {
  const own = new Map(ch.skills.map((s) => [s.id, s]))
  const rows: SheetSkill[] = SKILLS.map((def) => {
    const s = own.get(def.id)
    const base = skillBase(def, ch.characteristics)
    return { key: def.id, name: def.name, value: s?.value ?? base, improved: !!s && s.value > base }
  })
  for (const s of ch.skills) {
    if (SKILLS.some((d) => d.id === s.id)) continue
    const def = findSkill(s.id)
    rows.push({ key: s.id, name: s.label ?? def?.name ?? s.id, value: s.value, improved: true })
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'pl'))
}

function Values({ value }: { value: number }) {
  return (
    <span className="values">
      <b>{value}</b>
      <span>{half(value)}</span>
      <span>{fifth(value)}</span>
    </span>
  )
}

export function CharacterSheet({ character: ch }: { character: Character }) {
  const d = derive(ch)
  const archetype = findArchetype(ch.archetypeId)
  const details: [string, string][] = [
    ['Gracz', ch.player],
    ['Profesja', ch.occupation],
    ['Archetyp', archetype?.name ?? '—'],
    ['Wiek', String(ch.age)],
    ['Płeć', ch.sex],
    ['Miejsce zamieszkania', ch.residence],
    ['Miejsce urodzenia', ch.birthplace],
  ]
  const backstory: [string, string][] = [
    ['Opis postaci', ch.backstory.description],
    ['Ideologia/przekonania', ch.backstory.ideology],
    ['Ważne osoby', ch.backstory.significantPeople],
    ['Znaczące miejsca', ch.backstory.meaningfulLocations],
    ['Cenne przedmioty', ch.backstory.treasuredPossessions],
    ['Cechy charakteru', ch.backstory.traits],
  ]

  return (
    <article className="sheet">
      <header className="sheet-header">
        <Portrait character={ch} size="large" />
        <div>
          <p className="kicker">Pulp Cthulhu · karta badacza</p>
          <h1 className="headline">{ch.name}</h1>
          <dl className="details">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="panel">
        <h2>Cechy</h2>
        <div className="stats">
          {CHARACTERISTICS.map(({ key, name }) => (
            <div key={key} className={`stat${ch.coreCharacteristic === key ? ' stat-core' : ''}`}>
              <abbr title={name}>{key}</abbr>
              <Values value={ch.characteristics[key]} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Atrybuty pochodne</h2>
        <div className="derived">
          <div><span>PW</span><b>{ch.currentHp ?? d.hp}<small>/{d.hp}</small></b></div>
          <div><span>Poczytalność</span><b>{ch.currentSanity ?? d.sanity}<small>/99</small></b></div>
          <div><span>Szczęście</span><b>{ch.luck}</b></div>
          <div><span>PM</span><b>{ch.currentMp ?? d.mp}<small>/{d.mp}</small></b></div>
          <div><span>Ruch</span><b>{d.move}</b></div>
          <div><span>Krzepa</span><b>{d.build}</b></div>
          <div><span>Modyfikator obrażeń</span><b>{d.damageBonus}</b></div>
        </div>
      </section>

      <section className="panel">
        <h2>Umiejętności</h2>
        <ul className="skills">
          {sheetSkills(ch).map((s) => (
            <li key={s.key} className={s.improved ? 'improved' : undefined}>
              <span>{s.name}</span>
              <Values value={s.value} />
            </li>
          ))}
        </ul>
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>Talenty Pulp</h2>
          {ch.talentIds.length === 0 ? (
            <p className="muted">Jeszcze nie wybrano.</p>
          ) : (
            <ul>
              {ch.talentIds.map((id) => {
                const t = findTalent(id)
                return <li key={id}><strong>{t?.name ?? id}</strong>{t && ` — ${t.summary}`}</li>
              })}
            </ul>
          )}
        </section>
        <section className="panel">
          <h2>Ekwipunek i majątek</h2>
          <p>{ch.equipment || '—'}</p>
          <p><strong>Gotówka:</strong> {ch.cash || '—'}</p>
        </section>
      </div>

      <section className="panel">
        <h2>Historia postaci</h2>
        <dl className="backstory">
          {backstory.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  )
}
