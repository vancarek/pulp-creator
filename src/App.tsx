import { createHashRouter, Link, Outlet, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CharacterPage } from './pages/CharacterPage'

function Layout() {
  return (
    <>
      <header className="topbar no-print">
        <Link to="/" className="brand">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={28} height={28} />
          <span>Pulp Cthulhu</span>
        </Link>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}

// Routing przez # — GitHub Pages nie obsługuje ścieżek aplikacji jednostronicowej.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/p/:slug', element: <CharacterPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
