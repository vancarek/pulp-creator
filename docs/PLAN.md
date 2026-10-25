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
3. W aplikacji gracz otwiera `/pulp-creator/p/<slug>` i wpisuje hasło. Udane odszyfrowanie oznacza,
   że hasło jest poprawne; wtedy włącza się edycja tej karty, a zapis idzie przez API GitHuba do `pulp-data`.
4. Podgląd bez logowania: link `/pulp-creator/p/<slug>#k=<klucz>`. Klucz w części po `#` nie jest
   nigdzie wysyłany i odszyfrowuje token tylko do odczytu.

Klocki z `@maat-apps/core`: `/github` (`readRepoFile`, `writeRepoFile`, `GitHubError` z rodzajami
błędów, w tym `conflict` przy 409), `/crypto` (`encryptJson`/`decryptJson` na kluczu AES-GCM;
klucz wyprowadzamy z hasła przez PBKDF2, bo maat używa WebAuthn PRF), `/validation` (Valibot
wpis po wpisie). Format pliku postaci deterministyczny (stała kolejność pól, wcięcie 2, nowa
linia na końcu), żeby diffy w `pulp-data` pokazywały tylko faktyczne zmiany.

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

Schemat Valibot w `src/lib/character.ts` (typ `Character` wyprowadzony ze schematu). Pola odpowiadają
polskiej karcie postaci: cechy, punkty i stany (Agonia, niepoczytalność), umiejętności z zaznaczeniem
do rozwoju, uzbrojenie, pełna „Historia bohatera”, gotówka i dobytek, ekwipunek, znajomi bohaterowie. Obie ścieżki tworzenia dają ten sam format, więc karta,
edycja i PDF działają tak samo. Pole `origin` mówi, skąd postać pochodzi (`conversion` albo `new`).

## Reguły

W `src/lib/rules/`, jako dane i małe funkcje z testami:

- `characteristics.ts`: cechy (S, KON, BC, ZR, WYG, INT, MOC, WYK),
- `skills.ts`: umiejętności i wartości bazowe, **przepisane z oficjalnej polskiej karty** (wydanie „1930”),
- `archetypes.ts`, `talents.ts`: archetypy i talenty Pulp,
- `derived.ts`: PW w Pulp (KON+BC)/5, PM, Poczytalność, Ruch, Krzepa, Modyfikator obrażeń, budżet punktów.

**Do weryfikacji z polskim wydaniem:** polskie nazwy archetypów (obecne są robocze),
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

## Wygląd

UI na shadcn (`base-nova`, czyli komponenty Base UI) z motywem przeniesionym z oficjalnej polskiej karty:
papier `#f7dbb4`, granat `#41437e`, czerwień `#d04f5a`, łososiowy pas `#e8916b`, tło z promieniami,
nagłówki sekcji z paskami, klasyczne pola wartość/½/⅕. Czcionki: Barlow Condensed (zamiast Verlag
Condensed i Myriad Pro Bold Cond), Source Sans 3 (zamiast Myriad Pro), Rye w logo. Tryb ciemny: ta sama
karta „nocą” (granatowe tło). Dwie strony karty to dwie zakładki: Badacz i Historia.

## PDF

Etap 1: styl do druku i „Drukuj → Zapisz jako PDF” w przeglądarce (A4, polskie znaki bez problemu,
drukują się obie zakładki).
Później, jeśli zajdzie potrzeba: przycisk „Pobierz PDF” przez pdf-lib z dołączoną czcionką z polskimi znakami.

## PWA

Service Worker z `@maat-apps/core/sw` (przez `vite-plugin-pwa` w trybie `injectManifest`) i ręczny
`public/manifest.json`: aplikacja instalowalna, powłoka działa offline. Czcionki są w paczce, więc też.
Edycja tylko online.

## Etapy

1. **Szkielet** ✅: React + Vite + TS w strukturze maat-core, model danych (Valibot), reguły z testami,
   widok karty w stylu polskiej karty postaci (shadcn + Base UI), druk do PDF, PWA, CI/CD z maat-core,
   postać przykładowa.
2. **Dane i hasła:** repo `pulp-data`, skrypt szyfrujący tokeny, odblokowanie hasłem, odczyt i zapis
   przez API GitHuba, link podglądu, portrety z repo.
3. **Konwersja z Zewu:** formularz przepisywania karty i przeliczenia Pulp.
4. **Kreator nowej postaci.**
5. **Dopracowanie:** wybór portretu, cache offline kart, ewentualny eksport PDF przez pdf-lib.
