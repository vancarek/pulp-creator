import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks'
import { store } from '../store/store'
import { CharacterSheet } from '../components/CharacterSheet'

export function CharacterPage() {
  const { slug = '' } = useParams()
  const character = useAsync(() => store.get(slug), [slug])

  if (character.status === 'loading') return <p>Wczytywanie…</p>
  if (character.status === 'error') return <p className="error">{character.error}</p>
  if (!character.data) return <p>Nie ma postaci „{slug}”.</p>

  return (
    <>
      <div className="actions no-print">
        <button type="button" onClick={() => window.print()}>
          Drukuj / zapisz PDF
        </button>
      </div>
      <CharacterSheet character={character.data} />
    </>
  )
}
