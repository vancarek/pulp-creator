// Called once at app boot from src/main.tsx rather than from a React effect —
// a one-time app-wide startup action, not tied to any component's lifecycle.
export function registerServiceWorker(): void {
  // sw.js is only built in production (see vite.config.ts); registering it
  // in dev would fight Vite's own HMR with a caching service worker.
  // BASE_URL so a PR preview registers its own worker scoped to its subpath.
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => undefined);
  }
}
