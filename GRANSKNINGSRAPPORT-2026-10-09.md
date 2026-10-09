# DX Centralen – åtgärdsrapport 2026-10-09

## Omfattning
Granskning och ändring av problem 1–4 i DX Start och DX-OS. Uppdaterat:
- `1kuli1/dX-START/index.html`, commit `353b50a108da0888e5e0aaffbe24bb576cfabba6`
- `1kuli1/dx-os/modules/logcenter.html`, commit `32efa12a694711606b8687ea27130b8dda019fd7`

Före ändringarna skapades återställningsgrenarna `backup-before-reliability-fixes-2026-10-09` i båda projekten. Inga befintliga Google Sheets-celler eller användarloggar raderades eller skrevs om.

## Status per problem
1. **Raderade poster kan återkomma – klientdelen åtgärdad.** Lokalt bevaras raderingsmarkeringar (`_deletedAt`) i råa loggposter. De visas inte i normal loggbok, och äldre kopior med samma post-ID kan inte återställa dem vid JSON-sammanslagning. JSON-export innehåller även raderingshistorik. Automatiskt utbyte med Google Drive återstår innan servern uppgraderats.
2. **Separata loggböcker – delvis löst.** DX-OS och DX Start använder samma `localStorage`-nyckel (`dxLogs`) på samma webbursprung. DX-OS flyttar över äldre `dxloggar`-poster utan att skriva över eller radera originalet. Katastrof-DX är med avsikt separat. De två Google Sheets-huvudloggarna är ännu inte livekopplade.
3. **Osäker Drive-synk – skyddsåtgärd införd, inte slutligt löst.** Det gamla okontrollerade Apps Script-anropet är borttaget från aktuell DX Start-klient och nätverkssynkningen är spärrad. Lokala loggar, JSON-import och JSON-export fungerar kvar. Serverns åtkomstkontroll, gamla installationer och gammal publicerad kod måste separat granskas och säkras; enbart klientändring kan inte skydda en osäkrad befintlig server.
4. **Överlappande verktygsvyer – kodfelet rättat.** För starka CSS-regler har tagits bort, visning styrs av aktiv sida, och sidan uppdaterar `?tool=`-adressen och hjälpkontexten vid navigering.

## Genomförda kodtester
17 kontroller, samtliga godkända:
- Originalposter bevaras.
- Raderade poster visas inte.
- Äldre kopia återställer inte raderad post med samma ID.
- Raderingsmarkering förs över vid import av backup.
- Vanlig lokal lagring bevarar raderingsmarkering.
- Äldre DX-OS-poster migreras.
- Dubletter undviks vid upprepad migration.
- Originalnyckeln `dxloggar` lämnas orörd.
- Migration återställer inte raderad post.
- Navigering uppdaterar adressen.
- Inaktiv vy döljs.
- Hjälplänkens sammanhang uppdateras.
- Osäker Drive-synk är avstängd.
- Gammal Apps Script-URL saknas i aktuell klientkod.
- Gammal CSS-regel med `!important` är borttagen.
- Alla scriptblock i DX Start och DX-OS syntaxtestas.
- GitHub-läsning av aktuell DX Start-kod verifierar sparad version.

Tester kördes som isolerade funktionsprov med simulerad lokal lagring och DOM. De var inte fullständiga användartester i webbläsare på mobil, platta eller dator. Den publicerade GitHub Pages-sidan gick inte att verifiera från granskningsmiljön.

## Kvarvarande arbete innan fullständigt godkännande
- Granska och säkra Google Apps Script-servern: identifiering/autentisering, behörigheter per användare, åtkomstlogg, radering och versionssäker synk.
- Inför serverstöd för tombstones samt konflikt- och dubbletthantering och testa på två fysiska enheter.
- Verifiera att både vanlig DX och FM-DX kan läsas/skrivas till avsedd huvudloggbok; låt katastrofloggar vara separata.
- Genomför ända-till-ända-test i Chrome på Samsung mobil och surfplatta samt desktop och bekräfta GitHub Pages-publiceringen.
- Låt gammal serverdeployment inte vara publik/skrivbar utan autentisering, även om den nya klienten inte anropar den.

## Användning medan Drive-synken är pausad
1. Öppna `DX Start → Synk`.
2. Välj **Hämta fullständig säkerhetskopia (JSON)**.
3. För över JSON-filen till nästa enhet.
4. Välj **Sammanfoga säkerhetskopia** där.
5. Behåll JSON-filen som egen säkerhetskopia.

**Observera:** Detta är en manuell lösning. Automatisk synkning mellan enheter är ännu inte säkerhetsgodkänd.

---

## Etapp 2: fortsättning den 9 oktober 2026

### Säkerhetskopior på Google Drive
Innan fortsatt utveckling kopierades de två **originalböckerna utan att originalen ändrades**:
- [Backup – DX MASTER LOGGBOK](https://docs.google.com/spreadsheets/d/1RaimFROSVyZJeRarO_a5PLUnL1LIRApOzdnJVxPUruo/edit)
- [Backup – FM DX MASTER LOGGBOK](https://docs.google.com/spreadsheets/d/1Bn3KoCi0FkYW3kRTRv-BJ77XFmvY0DH6RYCVw4nVC_E/edit)

Backupkopiorna verifierades med 21 respektive 13 kalkylbladsflikar samt exempelvärden i loggbladens första rader.

### Reparerad Excel-import från huvudloggböcker
Commit `4c09c5cabeab949b279fdcacb405cc67897ddb65` kompletterar DX Start så att huvudböckernas verkliga fältnamn nu känns igen:
- DX Loggbok: `Kategori`, `Plats mottagare`, `Trolig station/signal`, `ID-ord / transkript`, `Stationens hemsida`, historiespalterna m.fl.
- FM Loggbok: `Frekvens MHz`, `Trolig station`, RDS/PI/PS/RT/PTY, ERP, antenn, historia m.fl.
- Bevarar skillnaden mellan kHz och MHz.
- Identifierar återimporterade observationer deterministiskt och försöker komplettera tomma fält i stället för att skriva över befintlig information.
- Respekterar raderingsmarkeringar vid återimport.

Commit `b02cc774dba7eb59dba3fae0b4d4c9eb734ae7f6` hindrar tomma källceller från att bli den bokstavliga texten "null". Olika observationer utan datum/tid kan få separata stabila import-ID:n.

**Test med levande innehåll från de två privata säkerhetskopiorna:** 41 DX-observationer och 7 FM-observationer importerades korrekt från tabellvärdena i hela respektive loggblad. Samtliga 48 fick rätt frekvensenhet, stationsnamn och unikt import-ID; 30 DX-poster respektive 4 FM-poster hade historikfält som hittades.

**Browsertest med Chromium:** Äkta exporterade Excel-filer öppnades, dekomprimerades och deras kalkylbladsstrukturer tolkades. DX-filen hade 82 ZIP-delar, FM-filen 50, och de 38 respektive 33 kolumnrubrikerna hittades på korrekta loggblad. Det är ett filformatstest; komplett klicktest av det publicerade DX Start-formuläret på fysisk Android återstår.

### Receiver Hub och stoppknapp
Commit `e19d1be46314730ba64b6b8a7eba23f4723ea43b`:
- Samtliga **49** tidigare falska "Favorit sparad"-knappar ersatta av riktiga favoriter, sparade i `localStorage`.
- Ny knapp **Mina favoriter**, med möjlighet att lägga till och ta bort samt tillgänglig `aria-pressed`.
- Bandfilter, sökning och favoritfilter fungerar tillsammans.
- Fasta ONLINE-märkningar ersattes med **STATUS EJ KONTROLLERAD**; ingen påhittad livekontroll.

Funktionen klarade **åtta simulerade UI-/funktionstester**: synlighet, knappbindning, lagring, tillgängligt tillstånd, favoriturval, kombinerat band+sök, kvarvarande bandfilter och borttagning.

Commit `9577c6739f7852bcc95fe62e9dc64abe122a475b`:
- Säker, separat fliköppning utan falsk popupvarning.
- En fungerande **Stoppa ljud i DX Start**-knapp stoppar eget ljud/CW/inspelning, inte externa SDR-flikar som webbläsaren inte kan stänga.
- Förklarande text på mottagarsidan.

De två äldre Receiver Hub-sidorna i **DX-OS** dirigeras till den enda uppdaterade mottagarlistan, så att användare inte hamnar på en gammal version:
- `dx-os/modules/receiver-hub.html`: commit `3bcbf17a91206b92bc4c48a0df55df9dc5731636`
- `dx-os/receiver-hub.html`: commit `8734a57733ac3c8aa6dc621089f6e688eaf9231a`

### Säkerhetsbedömning: ej slutligt löst
- Google Drive-metadata visade endast ägarbehörighet på de två originalkalkylböckerna. Det räcker **inte** för att godkänna det gamla offentligt åtkomliga Google Apps Script-endpointets behörigheter.
- Äldre Apps Script-deployment och serverkod gick **inte** att hitta eller administrera med tillgänglig anslutning.
- Automatisk Drive-synk i DX Start ska därför förbli **avstängd** tills en autentiserad och versionssäker server kan provas, inklusive återställnings-/raderingslogik.
- Återstående praktiska test: öppna publicerade sidor på Samsung-mobil, Samsung-platta och Windows samt validera hela flödet och externa mottagarlänkar. Aktuell publicerad GitHub Pages-HTML var inte direkt tillgänglig för automatisk extern webbgranskning.

### Nästa säkerhetssteg i Google Apps Script
1. Öppna det gamla Apps Script-projektet som användes för Drive-synk.
2. Kontrollera **Distribuera → Hantera distributioner** och vilka användare som kan komma åt varje aktiv webapp.
3. Inaktivera gamla offentliga/okända deployment-länkar efter att projektet och backupen verifierats.
4. Bygg ersättningsserver med inloggning/ägarkontroll, versions-ID och tombstones. Låt inte en dold URL räknas som autentisering.
5. Prova otillåten åtkomst med annat konto och synkning mellan två enheter **innan** klientens spärr tas bort.

Referens: [Google – Apps Script Web Apps](https://developers.google.com/apps-script/guides/web) samt [Apps Script manifest och åtkomstlägen](https://developers.google.com/apps-script/manifest/web-app-api-executable).

---

## Etapp 3 – förberedelse av intern PWA-testversion (9 oktober 2026)

**Status:** Koden uppdaterad, intern funktionskontroll utförd, användartest ej genomfört.

### Skydd för loggar
- `index.html`: Vid korrupt `dxLogs`-JSON blockeras nya skrivningar så att den skadade originalsträngen inte skrivs över. Om `localStorage` avvisar en skrivning (till exempel fullt minne) bekräftas inte loggposten som sparad.
- Skyddet gäller ny logg, radering, JSON-import och Excel-import. Skriptet hanterar raderingsmarkeringar och kräver tydlig bekräftelse vid JSON-import som kan markera poster raderade.
- JSON-exportens nedladdningslänk hålls tillgänglig längre, vilket förbättrar stabiliteten på mobila webbläsare.
- Mobilvyn gömmer inte längre två loggtabellkolumner. De finns kvar i en sidledsrullningsbar tabell.
- Fyra verifieringsnivåer: Preliminär, Osäker, Trolig, Bekräftad.
- 31 fältetiketter kopplades till rätt kontroller. Loggrader kan aktiveras med Enter eller mellanslag.
- **Varning:** Detta ersätter inte användarens egna JSON-säkerhetskopior. Webbläsardata kan fortfarande rensas av användaren, operativsystemet eller webbläsaren.

### PDF-guider
- `guider.html`: PDF öppnas utan riskabel omdirigering i aktuell flik när ett `noopener`-fönster saknar returhandtag.
- Alla 29 guider har nu en separat **Ladda ned PDF**-knapp.

### PWA (DX Start-projektet)
- Nya filer: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon.svg`.
- Manifestet har korrekta installationsfält, PNG-ikoner med verifierade verkliga mått (192×192 och 512×512) samt `scope` och `start_url` som gäller `/dX-START/`.
- Service worker registreras från `index.html`, `receiver-hub.html`, `guider.html`, `asta.html`, `dx-help.html`.
- Service worker cachar enbart egna statiska programsidor och tillhörande installationsfiler. Inte användarloggar, tredjeparts-SDR eller internetradioströmmar.
- Webbuppdateringar prioriteras före offlinekopian och ett fullt cacheutrymme ska inte göra nätanslutet läge oanvändbart.
- **Begränsning:** Installerad PWA omfattar i nuläget **DX Start-projektet**, inte automatiskt sidor under `/dx-system/` eller `/DX-Academy/`. De behöver integreras i samma appområde om den slutliga produkten ska vara en enda PWA.
- **Begränsning:** Dessa ändringar gör ännu inte en självständig APK eller Windows-installationsfil. PWA-installationen ska provas i riktiga Chrome/Edge.
- Automatisk Google Drive-synk förblir blockerad. Publik pilot kan senare använda personlig lokal loggbok och frivillig manuell JSON-backup utan inloggning.

### Tester
En samlad kontroll gav **33/33 godkända statiska och isolerade funktionstester** av HTML/JS, PWA-konfiguration, PDF-nedladdningar, sparning, radering, äldre JSON, skydd mot skadad lagring och fullt lagringsutrymme. Separat verifierades PNG-header och dimensionerna för båda ikonerna.

**Ej testat:** fysisk Samsung A52/Tab S9, Windows-installation, webbläsarens verkliga service worker/offline-drift, publicerad GitHub Pages-körning, riktiga externa SDR-mottagare samt tillgänglighet med skärmläsare.

**Testplan:** [BETA-TESTPLAN-2026-10-09.md](BETA-TESTPLAN-2026-10-09.md). Teststart sker först efter att intern acceptanskontroll är genomförd. Försäljning eller fristående distribution planeras först efter pilotperioden.
