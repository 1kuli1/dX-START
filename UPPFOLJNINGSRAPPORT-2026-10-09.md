# DX Centralen – förnyad granskning
**Datum:** 9 oktober 2026  
**Typ:** Läsning av senaste GitHub-koden, statiska kontroller och isolerade funktionstester.  
**Ändring av programkod under granskningen:** Ingen.

## Sammanfattning
DX Centralen är ännu **inte redo för extern betatestning**. Flera av tidigare fel är rättade, men återstående dataförlustrisker och importerade datatyper behöver lösas först. GitHub Pages driftsatta webbsidor och Android-/Windows-installation gick inte att komma åt för praktisk testning.

## Bekräftade blockerare före pilot

### P0-1: DX-OS kan fortfarande skriva över en skadad gemensam loggbok
- **Fil:** `1kuli1/dx-os/modules/logcenter.html`
- **Orsak:** `dxosRead("dxLogs")` fångar alla JSON-fel och returnerar `[]`. `dxosMigrate()` skriver därefter migrerade äldre `dxloggar`-poster till nyckeln `dxLogs`.
- **Återskapat:** `dxLogs="{broken"`, `dxloggar=[en testpost]` → migrationen skriver över `{broken` med en ny array. Detta gäller även om det bättre skyddet i DX Start är infört.
- **Åtgärd:** Stoppa all skrivning i DX-OS när `dxLogs` är oläsbar, visa tydlig varning och kräv en säker backup/återställning. Även andra vägar som skriver till samma nyckel måste granskas.

### P0-2: JSON-import med numeriska värden kan göra loggbokstabellen obrukbar
- **Fil:** `1kuli1/dX-START/index.html`
- **Orsak:** JSON-import validerar att arrayelement är objekt men inte att fält är strängar. `renderLogs()` anropar `esc(l.freq)` där `esc(s)` använder `(s||'').replace(...)`.
- **Återskapat:** en logg med `freq:1008` ger `(s || "").replace is not a function`; tabellrenderingen avbryts.
- **Åtgärd:** Schema-validera/normalisera importerade fält och gör utskriftsfunktionen tolerant för tal/null.

### P0-3: Historiska loggar är inbakade i det offentliga projektet
- **Filer:** `dX-START/dx-recovery-seed-2026-10-07.json` (48 observationer), `dX-START/index.html` (8 förinlagda kartobservationer).
- **Bekräftat:** GitHub-repot `1kuli1/dX-START` är publikt. Historiska observationer ligger i det offentliga källmaterialet, oberoende av att Google Sheets-originalen inte är allmänt delade.
- **Risk:** En distributions- eller testversion kan innehålla observatörens tidigare loggar och stationsdetaljer. Personuppgifts- och sekretessbedömning måste göras.
- **Åtgärd:** Separera privata/reella loggar och neutrala exempeldata. Undersök separat om GitHub-historik eller publicerade filer behöver saneras; det räcker inte att ta bort referenser på startsidan.

### P1-4: Äldre JSON-kopior skapar fortfarande dubletter
- **Fil:** `dX-START/index.html`
- **Orsak:** `dxNormalizeLog` bygger legacy-ID från bland annat `saved` och `content`, så två kopior av samma observation kan få skilda ID:n.
- **Återskapat:** två loggobjekt med samma datum, UTC, frekvens, station, mottagare och mode men med olika `saved` förenas till **två** poster av `dxMergeLogs`.
- **Åtgärd:** Dubblettkontroll på observationernas naturliga fält, med uttryckliga regler för legitima upprepade DX-lyssningar på samma station.

## Övrigt kvarvarande arbete

### P1: Lagring och synkning
- Den osäkra, äldre Apps Script-synkningen är medvetet blockerad (`DX_SYNC_SAFE=false`). Detta **skyddar klienten**, men den äldre serverns åtkomststatus kunde inte verifieras.
- Ingen automatisk synk mellan användarens flera enheter. JSON-export/import finns och fungerar som manuellt arbetssätt.
- En varaktig backup- och återställningsrutin är ännu inte tillräckligt praktiskt testad på telefon och platta.
- När `dxLogs` är korrupt visar `getLogRecords()` visserligen en loggning till JavaScript-konsolen, men vanliga loggbokstabellen kan se tom ut tills användaren försöker spara. Varningen behöver bli synlig direkt.

### P1: Installerbar PWA
- `manifest.webmanifest`, `sw.js` och riktiga PNG-ikoner finns i `dX-START`.
- Den installeras endast inom webbområdet `/dX-START/`; `/dx-system/`, `/dx-os/` och `/DX-Academy/` är inte integrerade som delar av samma offline-app.
- Faktisk installation i Chrome på Samsung Galaxy A52, Samsung Tab S9 och Windows samt offlineåterstart är **inte testad** från kontrollmiljön.
- Service worker cachar bara statiska programsidor, inte externa radioströmmar eller andra projekt.

### P1: Loggbokens efterfrågade funktioner
- Ny sparning ger inte automatiskt preliminär SINPO från signalbeskrivning.
- Bekräftade amatör-QSO skapar inte automatiskt en fullständig personlig SWL-rapport med QSL-spårning.
- Stations- och ortshistoria kan importeras från Excel, men det ordinarie nyloggningsformuläret sparar inte två separata historikfält.
- Frekvens och enhet är fortfarande löst fritextfält vid ny logg. MHz/kHz behöver kontrollerad enhet för att motverka missförstånd.
- Kartan blandar in förinlagda observationer; de behöver tydligt separeras från den nya användarens egna verifierade loggar.

### P2: Mottagare, guider och Asta
- Riktiga favoriter finns för 49 mottagare och band/sök/favoritfilter använder en samlad filterfunktion.
- Missvisande fast ONLINE-status har bytts mot okontrollerad status, men ingen automatisk driftövervakning av de externa SDR:erna finns.
- PDF-guider: 29 öppna- och nedladdningsalternativ samt ingen känd `noopener`-omdirigering till samma flik; mobilens faktiska hantering måste verifieras.
- DX Academy: av 16 granskade sidor hade endast startsidan en synlig referens till Asta. Assistenten är dessutom en kopiera-text-och-öppna-ChatGPT-lösning, inte tekniskt integrerad med aktuell mottagare.
- Katastrof-DX har lokal separat loggbok men ingen livehämtning av händelser eller automatiska pushaviseringar.
- Receiver Hub `?band=...` döljer den övergripande filter- och sökpanelen. Efter återställning med `showAllReceivers()` rensas query-parametern men `band-view`-klassen tas inte bort; navigeringsstatus behöver kontrolleras.

### P1/P2: Tillgänglighet och juridik
- I DX Start finns flera positiva rättningar, bland annat 31 kopplade formuläretiketter och tangentbordsaktivering av loggrader.
- 16 kontrollerade Academy-sidor hade svensk språktagg och mobil viewport, men knapp-/hjälpstrukturen behöver kontrolleras bredare.
- Manuell kontroll återstår: skärmläsare, TalkBack, tangentbord, 200–400 % förstoring, kontrast, mobila tabeller och formulärfel.
- `dx-system/COMPLIANCE.md` innehåller ytterligare ej avprickade uppgifter, bland annat GDPR-information, användarrättigheter, tredjepartslänkar och upphovsrätt. Vissa gäller först vid försäljning, inte automatiskt en sluten pilot.
- CSV-export kapslar fält i citattecken, men skyddar inte särskilt mot kalkylbladsformler i importerad/angiven text. Kontrollera detta innan exporter lämnas vidare.

## Bekräftade förbättringar sedan första granskningen
- Automatisk Drive-synk spärrad på klientsidan.
- Tombstones finns för lokal borttagning.
- Skydd mot fel vid lokal lagring har införts i huvud-DX Start.
- 49 mottagar-favoritknappar lagrar tillstånd, inga gamla falska `Favorit sparad`-meddelanden.
- Band/sök/favoritfilter är samordnade.
- 29 guider har öppna och nedladdningsknappar.
- Grundläggande PWA-delar är inlagda.
- 31 fältetiketter rättade, tangentbordsöppning av loggrader, mobila tabellkolumner döljs inte längre.

## Kontroller som faktiskt utförts vid denna granskning
- GitHub-läsning av de senaste filerna i fyra repo: `dX-START`, `dx-system`, `dx-os`, `DX-Academy`.
- JavaScript-syntax: **8/8 viktiga sidor** utan parserfel.
- Kända positiva åtgärder: **12/12 statiska kodkontroller** godkända.
- Interna guider: **21 länkar**, inga okända ankare. Hjälplänkar: **2 kontroller**, inga okända ankare.
- Academy: **16 undersidor** granskade på språktagg, mobil-vy och synlig Asta-hjälp.
- Funktionell reproduktion av **DX-OS dataöverskrivning**, **numeriskt fält ger renderingsfel** och **dublett vid äldre JSON-import**.
- Kontroll av PWA-manifest och registrering i källkod, men **ingen verifierad installation eller offlinekörning på fysisk enhet**.
- GitHub Pages-URL:erna gick inte att hämta via webbgranskningsverktyget. Driftsatt innehåll, nätverk och externa SDR-länkar kan därför inte slutgodkännas härifrån.

## Föreslagen reparationsordning
1. Stoppa DX-OS från att skriva över oläsbara loggdata och hårdgör samtliga vägar som skriver `dxLogs`.
2. Validera JSON och gör loggvisning tolerant för nummer/null; säkra import och dubbletthantering.
3. Separera den offentliga programutgåvan från återställningsfilen och historiska personliga kartposter.
4. Kontrollera lokala säkerhetskopior och återställning på två enheter.
5. Samla appen under en sammanhängande installationsstruktur.
6. Slutför loggstandarderna (SINPO, historik, SWL/QSL), hjälp och användartester.
7. Gör manuell tillgänglighetskontroll och gå sedan vidare med en begränsad pilot.

**Beslut:** Inga testpersoner bör börja använda riktiga, oersättliga DX-loggar förrän de tre P0-problemen är åtgärdade och säkerhetskopiering/återställning har provats praktiskt.
