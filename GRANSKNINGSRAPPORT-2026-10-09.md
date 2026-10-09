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
