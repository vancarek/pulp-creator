# Kreator Pulp Cthulhu

Kreator i karty postaci do Pulp Cthulhu (polskie wydanie). Działa jako zwykła strona na GitHub Pages i jako PWA, na telefonie i komputerze.

Projekt i plan prac: [docs/PLAN.md](docs/PLAN.md).

## Uruchomienie lokalne

```bash
npm install
npm run dev            # serwer deweloperski
npm run test:coverage  # testy jednostkowe
npm run test:e2e       # testy Playwright na buildzie produkcyjnym
npm run validate       # wszystko, co sprawdza CI
```

Struktura i konwencje jak w [maat-core](https://github.com/maat-apps/maat-core/blob/main/STRUCTURE.md);
szczegóły w [CLAUDE.md](CLAUDE.md).

## Wdrożenie

Workflowy w `.github/workflows/` wywołują wspólne pipeline'y z maat-core:

- `ci.yml` na każdym PR: lint, format, typecheck → testy jednostkowe i e2e → build i `npm audit`,
- `cd.yml` po pushu na `main`: build i publikacja na GitHub Pages (przez gałąź `pages-content`).

Jeśli Pages się nie włączy samo przy pierwszym wdrożeniu: **Settings → Pages → Source: GitHub Actions**.
