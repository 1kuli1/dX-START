# DX Centralen – genomförda rättningar
**Datum:** 9 oktober 2026  
**Omfattning:** Förnyad granskning, rättning och verifiering i GitHub, inte ett fullständigt fälttest.  
**Berörda projekt:** `1kuli1/dX-START`, `1kuli1/dx-os`, `1kuli1/dx-system`, innehåll kopierat från `1kuli1/DX-Academy`.

## Sammanfattning
De tre främsta kodriskerna från uppföljningsgranskningen är avhjälpta i den **aktuella publicerade källkoden**. Enhetstester och verklig PWA-installation återstår innan programmet kan förklaras färdigt för pilotgruppen.

### 1. DX-OS kan inte längre skriva över skadade loggar
- `dx-os/modules/logcenter.html`: oläsbar eller felstrukturerad `dxLogs` stoppar migration och sparning. Inga gamla poster skrivs till den skadade lagringen.
- Vid problem visas en varning och den tidigare lokala strängen lämnas orörd.
- Test med `dxLogs="{broken"` samt en äldre `dxloggar`-post gav ingen överskrivning. Normal migration är fortfarande idempotent.

### 2. JSON-loggar med siffror/null kraschar inte loggbokstabellen
- `dX-START/index.html`: `dxNormalizeLog()` gör förväntade textfält till strängar även när de är tal, null eller boolean.
- `esc()` hanterar null/tal och HTML-escapar innehållet.
- När lokal data är skadad visas varning direkt i tabellen och ingenting sparas förrän problemet är åtgärdat.

### 3. Dubletter och raderingsmarkeringar
- Två äldre JSON-kopior av samma observation, med olika tidpunkt för sparning, kan slås ihop.
- Separata loggar med egna ID:n bevaras även om deras innehåll råkar sammanfalla.
- Raderingsmarkeringar vinner över äldre aktiva kopior.
- Notera: alla tänkbara dubblettscenarier kan inte lösas utan risk för att olika observationer felaktigt sammanslås. De nya reglerna är avsiktligt försiktiga.

### 4. Privata data har skilts från nuvarande öppna programversion
- `dx-recovery-seed-2026-10-07.json` med 48 äldre observationer är borttagen från `main`.
- 8 förinlagda kartposter är borttagna ur `index.html`. Kartan bygger nu på respektive användares egna verifierade observationer.
- Direktlänkar till ägarens privata Drive-huvudböcker är borttagna ur programmet. Referenser i den aktuella offentliga granskningsrapporten har sanerats.
- Ägarens Google Drive-original och säkerhetskopior har **inte** ändrats.
- **Begränsning:** Tidigare publika GitHub-commitversioner och säkerhetskopiegrenar kan fortfarande innehålla materialet. Att ta bort aktuell fil sanerar inte hela historiken. Före bred spridning behövs bedömning av vad som tidigare publicerats; en ny ren distributionsrepository kan vara den säkraste vägen.

### 5. En gemensam installerbar PWA
- DX Centralens centrala startsida finns nu som `dX-START/centralen.html`.
- `katastrof-dx.html` och hela DX Academy har kopierats till samma PWA-område, inklusive 36 källfiler (HTML/JS/CSS) och 6 ljudexempel.
- De kopierade Academy-filerna är tillgängliga under `/dX-START/academy/`; en felaktig dubbel mappnivå rättades och rensades.
- Appens manifest startar `centralen.html`. Service worker omfattar nya startsidan, Katastrof-DX och Academy; egna statiska Academy-filer cachas vid besök.
- Interna tillbaka-länkar i DX Start, Receiver Hub, guider och Asta pekar mot nya centralen. Den äldre adressen `/dx-system/` öppnar nu nya centralen.
- Ingen ljudström från extern SDR och inga personliga loggar cachas av service workern.
- **Begränsning:** Övriga äldre fristående DX-OS-verktyg är inte helt integrerade. Offline kräver att sidan har besökts medan internet fanns.

### 6. Loggstandarder och SWL
- Välj frekvensenhet kHz/MHz; felaktigt formaterad frekvens avvisas vid nysparning.
- Fält för `txHistory` och `placeHistory` sparas separat och visas i stationskortet.
- Preliminär SINPO kan föreslås från en beskrivning av signalstyrka/fading. Ingen beskrivning ger ingen påhittad rapport.
- Vid uttrycklig markering av bekräftat amatör-QSO, med erforderliga uppgifter, skapas ett SWL-utkast som kan hämtas som text. **Ingenting skickas automatiskt.**
- Stationswebblänkar begränsas till HTTP/HTTPS i stationskortet.

### 7. Kontinuerlig kontroll
- `tests/dx-regression.cjs`: kontroller för äldre dubletter, normaliserade data, tombstones, SINPO, SWL, PWA-filer, PDF och favoritkod.
- `.github/workflows/dx-regressions.yml`: automatiska GitHub Actions-tester vid push, pull request eller manuell körning.
- **GitHub Actions-körning [37959946626](https://github.com/1kuli1/dX-START/actions/runs/37959946626): SUCCESS**.
- Dessutom 23 isolerade lokala funktioner/static-kontroller med godkända resultat mot aktuell kod (före de allra sista dokumentationsändringarna).
- Källfilerna syntaxkontrollerades vid ändringarna.

## Vad som fortfarande återstår
**Inte löst eller inte praktiskt verifierat:**
1. Den gamla Google Apps Script-servern och gamla deployment-åtkomster kan inte hanteras från nuvarande anslutning. Automatisk Drive-synk är fortsatt **avstängd**. Ingen obligatorisk inloggning har lagts till.
2. Äldre GitHub-historik kan innehålla personlig data; detta kräver en separat publiceringsåtgärd innan en offentlig distributions-/säljversion.
3. Fullständig praktisk test på Samsung A52, Tab S9 och Windows i Chrome/Edge: installation, offline, skärmläsare, utskrift, mottagarlänkar och återställning från JSON.
4. Varje extern SDR-mottagares tillgänglighet och frekvenskapacitet är ännu inte verifierad i verklig drift; bara URL och gränssnitt kan granskas i koden.
5. Asta är fortfarande en frivillig fråga-via-ChatGPT-lösning, inte en direkt integrerad SDR-analysassistent.
6. Katastrof-DX har separat lokal loggbok men inget pålitligt inbyggt automatiskt katastroflarm.
7. Rättslig och manuell tillgänglighetskontroll enligt dokumenterad checklista kvarstår för verklig distribution/test med andra.
8. Inga faktiska automatgenererade SWL-rapporter har skickats och inget QSL-svar har verifierats i fälttest. Funktionen skapar bara utkast.
9. En helt fristående kopia (APK/Windows-app för försäljning) är **inte** byggd nu, enligt beslut att vänta tills efter testperioden.

## Rekommenderad nästa aktivitet
1. Ta JSON-säkerhetskopia av befintlig lokal DX-loggbok.
2. Öppna [DX Centralen](https://1kuli1.github.io/dX-START/centralen.html) i Chrome, välj Loggbok och testa en fiktiv observation.
3. Kontrollera att PWA kan installeras via Chrome-menyn och att sidorna fungerar både med och utan nätuppkoppling.
4. Prova JSON-export/import mellan två enheter innan testgruppen får använda skarpa loggar.
5. Testa samtliga mottagare och hjälpflöden med fysisk enhet och återstående tillgänglighetschecklista.

**Pilotstatus:** Teknisk kodbas betydligt säkrare. Fortfarande inte fullständigt fält- och säkerhetsgodkänd för externa testpersoner.
