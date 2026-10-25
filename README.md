# Kreator Pulp Cthulhu

Kreator i karty postaci do Pulp Cthulhu (polskie wydanie). Działa jako zwykła strona na GitHub Pages i jako PWA, na telefonie i komputerze.

Projekt i plan prac: [docs/PLAN.md](docs/PLAN.md).

## Uruchomienie lokalne

```bash
npm install
npm run dev      # serwer deweloperski
npm test         # testy reguł
npm run build    # build produkcyjny do dist/
```

## Wdrożenie

Push na `main` uruchamia `.github/workflows/deploy.yml`, który buduje aplikację i publikuje ją na GitHub Pages.
Jednorazowo trzeba włączyć Pages: **Settings → Pages → Source: GitHub Actions**.
