import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { AppShell } from "./app-shell";

const HomeView = lazy(() =>
  import("../views/home/home-view").then((m) => ({ default: m.HomeView })),
);
const PortraitView = lazy(() =>
  import("../views/portrait/portrait-view").then((m) => ({
    default: m.PortraitView,
  })),
);
const EditView = lazy(() =>
  import("../views/edit/edit-view").then((m) => ({ default: m.EditView })),
);
const CharacterView = lazy(() =>
  import("../views/character/character-view").then((m) => ({
    default: m.CharacterView,
  })),
);

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            path="/"
            element={
              <Suspense>
                <HomeView />
              </Suspense>
            }
          />
          <Route
            path="/p/:slug"
            element={
              <Suspense>
                <CharacterView />
              </Suspense>
            }
          />
          <Route
            path="/p/:slug/portret"
            element={
              <Suspense>
                <PortraitView />
              </Suspense>
            }
          />
          <Route
            path="/p/:slug/edytuj"
            element={
              <Suspense>
                <EditView />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
