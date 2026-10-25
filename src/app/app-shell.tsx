import { Link, Outlet } from "react-router";

export function AppShell() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b-4 border-double border-pulp-red bg-chrome pt-[env(safe-area-inset-top)] print:hidden">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link
            to="/"
            // Same style as the section headings; on the navy bar the outline
            // and drop go a darker navy so they still read.
            className="pulp-heading text-3xl leading-none [--heading-stroke:#15163a]"
          >
            Pulp Cthulhu
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] print:max-w-none print:p-0">
        <Outlet />
      </main>
    </>
  );
}
