# Kreator Pulp Cthulhu: projekt

## Cel

Kreator postaci do Pulp Cthulhu (polskie wydanie, polskie nazwy) dla jednej drużyny:

- większość graczy przenosi postacie z papierowych kart Zewu Cthulhu (MG przepisuje dane ręcznie),
- jeden gracz tworzy postać od zera,
- każda postać ma stałe hasło ustawione przez MG, związane z postacią,
- portrety wygenerowane wcześniej przez AI, do wyboru,
- eksport karty do PDF,
- podgląd karty przez link, bez logowania,
- dobre działanie na telefonie i komputerze, jako strona i jako PWA.

## Architektura: bez backendu

```
pulp-creator (publiczne)                    pulp-data (prywatne) — źródło prawdy
├─ aplikacja React → GitHub Pages           ├─ players.json        slug, imię, hasło (ustawia MG)
└─ public/access/<slug>.json                ├─ characters/<slug>.json
   token zapisu zaszyfrowany hasłem postaci └─ portraits/*.webp
```

1. MG edytuje `players.json` w `pulp-data` (hasła jawnym tekstem; repo jest prywatne).
2. Skrypt (`npm run access`, później GitHub Action w `pulp-data`) dla każdej postaci szyfruje
   fine-grained token GitHuba (dostęp tylko do `pulp-data`, Contents: read/write) hasłem tej postaci
   (PBKDF2 → AES-GCM) i zapisuje wynik w `public/access/<slug>.json`.
3. W aplikacji gracz otwiera `#/p/<slug>` i wpisuje hasło. Udane odszyfrowanie oznacza, że hasło
   jest poprawne; wtedy włącza się edycja tej karty, a zapis idzie przez API GitHuba do `pulp-data`.
4. Podgląd bez logowania: link `#/p/<slug>?k=<klucz>`. Klucz w części po `#` nie jest nigdzie wysyłany
   i odszyfrowuje token tylko do odczytu.

### Świadome kompromisy

- **Miękka izolacja:** token zapisu jest wspólny, więc kto zna jakiekolwiek hasło, może technicznie
  zapisać każdą kartę. Historia gita pokazuje każdą zmianę i pozwala ją cofnąć. Pełna izolacja wymaga
  osobnego repo i tokenu na postać albo małego backendu (Cloudflare Worker).
- **Hasła da się zgadywać offline**, bo zaszyfrowane bloby są publiczne. Lepsze są hasła wielowyrazowe
  (np. `Innsmouth-latarnia-1926`) i PBKDF2 z dużą liczbą iteracji.
- **Token do odczytu jest jeden:** kto ma link podglądu do swojej karty, może odczytać też cudze.
- **Tokeny wygasają:** przy odnowieniu tokenu trzeba ponownie uruchomić skrypt i wdrożyć aplikację.
- **Konflikty zapisu:** API GitHuba odrzuca zapis z nieaktualnym `sha` (409). Aplikacja pokazuje wtedy
  różnice i prosi o ponowny zapis.

## Model danych

Typ `Character` w `src/model/character.ts`. Obie ścieżki tworzenia dają ten sam format, więc karta,
edycja i PDF działają tak samo. Pole `origin` mówi, skąd postać pochodzi (`conversion` albo `new`).

## Reguły

W `src/rules/`, jako dane i małe funkcje z testami:

- `characteristics.ts`: cechy (S, KON, BC, ZR, WYG, INT, MOC, WYK),
- `skills.ts`: umiejętności i wartości bazowe,
- `archetypes.ts`, `talents.ts`: archetypy i talenty Pulp,
- `derived.ts`: PW w Pulp (KON+BC)/5, PM, Poczytalność, Ruch, Krzepa, Modyfikator obrażeń, budżet punktów.

**Do weryfikacji z polskim wydaniem:** nazwy umiejętności, polskie nazwy archetypów (obecne są robocze),
cechy główne i umiejętności archetypów, lista talentów, zasady konwersji z Zewu Cthulhu.
Opisy talentów i archetypów własnymi słowami: treść podręcznika jest objęta prawami Chaosium,
a repo aplikacji jest publiczne. Pełne opisy mogą leżeć w `pulp-data`.

## Ścieżki tworzenia postaci

**Konwersja z Zewu (MG przepisuje z papieru):** formularz cech i umiejętności, potem wybór archetypu
i cechy głównej, punkty z archetypu, talenty, przeliczenie PW i Szczęścia według zasad Pulp.

**Nowa postać:** kreator krok po kroku: koncept → archetyp → cechy (rzut w aplikacji albo wpisanie)
→ profesja → umiejętności (licznik punktów) → talenty → historia → portret → podsumowanie.

Na telefonie kroki z przyklejonym dolnym paskiem (punkty, Dalej/Wstecz), na komputerze formularz
i podgląd karty na żywo obok siebie.

## Portrety

MG wrzuca pliki do `pulp-data/portraits/` (WebP, ok. 1024 px). Aplikacja pobiera je przez API
tym samym tokenem co karty i zamienia na `data:` URL, żeby trafiały też do PDF.
Do decyzji: czy wybrany portret znika z puli dla pozostałych postaci.

## PDF

Etap 1: styl do druku i „Drukuj → Zapisz jako PDF” w przeglądarce (A4, polskie znaki bez problemu).
Później, jeśli zajdzie potrzeba: przycisk „Pobierz PDF” przez pdf-lib z dołączoną czcionką z polskimi znakami.

## PWA

`vite-plugin-pwa`: manifest i Service Worker, aplikacja instalowalna, wcześniej otwarte karty
dostępne offline do odczytu. Edycja tylko online.

## Etapy

1. **Szkielet** ✅: React + Vite + TS, model danych, reguły z testami, widok karty, styl do druku,
   PWA, wdrożenie na Pages, postać przykładowa.
2. **Dane i hasła:** repo `pulp-data`, skrypt szyfrujący tokeny, odblokowanie hasłem, odczyt i zapis
   przez API GitHuba, link podglądu, portrety z repo.
3. **Konwersja z Zewu:** formularz przepisywania karty i przeliczenia Pulp.
4. **Kreator nowej postaci.**
5. **Dopracowanie:** wybór portretu, cache offline kart, ewentualny eksport PDF przez pdf-lib.
