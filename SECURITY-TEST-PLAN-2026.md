# Beslut och testprotokoll – separata DX-loggböcker
Datum: 2026-10-13
Status: Godkänt arkitekturbeslut, ej produktionsgodkännande.

## Beslut
- Varje användare behåller sin egen lokala loggbok i sin webbläsares lagring.
- Ingen delad loggdatabas införs.
- Google Drive-synkronisering är endast avsedd för ägarens egna loggar och ska kräva separat, säker konfiguration. Den får inte aktiveras globalt i en publik PWA.
- Andra användare ska inte kunna läsa eller skriva ägarens Drive-loggar.
- Ingen publicering innan test och uttryckligt godkännande.

## Statisk kodkontroll på granskningsgrenen
- [x] index.html använder localStorage för dxLogs.
- [x] DX_SYNC_SAFE=false och DX_SYNC_URL=null; automatisk Drive-synkronisering är avstängd.
- [x] sw.js begränsar cachning till uttryckligen tillåtna resurser.
- [x] linkifyText har uppdaterats för validerade och HTML-escaped länkar.
- [ ] Dynamiskt test i webbläsare med två separata profiler/enheter.
- [ ] Export/import/återställning med representativa testloggar.
- [ ] Offline/online och uppdatering utan förlust av loggar.
- [ ] Granskning av övriga HTML-injektioner och externa beroenden.
- [ ] Verifiera att inga personuppgifter/hemligheter finns i publicerade resurser eller historik.
- [ ] Separat juridisk bedömning enligt GDPR och cybersäkerhetslagen.

## Testfall
1. Profil A: skapa tre testloggar; verifiera att de syns efter omladdning.
2. Profil B: öppna samma webbplats; verifiera att profil A:s loggar inte syns.
3. Exportera A; importera i separat testprofil; kontrollera antal, innehåll och dubbletter.
4. Testa uppdatering av service worker offline/online; verifiera att A:s loggar kvarstår.
5. Simulera ogiltig JSON i testprofil; verifiera felmeddelande och möjlighet att exportera rådata.
6. Kontrollera att Google Drive inte kontaktas automatiskt.

OBS: Lokal lagring är inte likvärdig med stark användarautentisering och kan läsas av personer med åtkomst till samma webbläsarprofil/enhet. För känsliga uppgifter krävs ytterligare skydd.
