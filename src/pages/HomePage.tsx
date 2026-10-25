import { Link } from 'react-router-dom'
import { useAsync } from '../hooks'
import { store } from '../store/store'
import { findArchetype } from '../rules/archetypes'
import { Portrait } from '../components/Portrait'

export function HomePage() {
  const characters = useAsync(() => store.list(), [])

  return (
    <section>
      <h1 className="headline">Badacze</h1>
      <p className="lede">Wybierz swoją postać. Edycja wymaga hasła od Strażnika Tajemnic.</p>
      {characters.status === 'loading' && <p>Wczytywanie…</p>}
      {characters.status === 'error' && <p className="error">{characters.error}</p>}
      {characters.status === 'ok' && (
        <ul className="roster">
          {characters.data.map((c) => (
            <li key={c.slug}>
              <Link to={`/p/${c.slug}`} className="roster-card">
                <Portrait character={c} size="small" />
                <div>
                  <strong>{c.name}</strong>
                  <span>{[c.occupation, findArchetype(c.archetypeId)?.name].filter(Boolean).join(' · ')}</span>
                  <small>Gracz: {c.player}</small>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
