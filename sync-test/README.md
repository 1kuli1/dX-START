# DX Start – privat automatisk Drive-synk (testgren)

Status: **design och testunderlag**, inte aktiverad drift. Den publicerade `main`-versionen ändras inte.

## Avsikt
När en loggpost skrivs till användarens privata Google Sheets-huvudloggbok ska DX Start på samma användares inloggade enhet kunna hämta den utan filimport. Behåll lokal loggbok för offlinebruk.

## Säkerhetsmodell
- GitHub Pages är offentlig. Lägg **aldrig** Google-token, service account-nyckel, Apps Script-URL med hemlig nyckel, hela privata loggböcker eller användarens Drive-ID som offentlig datakälla i denna kod.
- Google OAuth med PKCE i webbläsaren, minimal read-only Sheets-scope (`spreadsheets.readonly`) och explicit användarsamtycke. Kräver konfiguration av Google Cloud OAuth-klient och godkänd origin; det går inte att slutföra utan kontoinställningarna.
- Förvara inte långlivade access-/refresh-token i GitHub, lokalStorage eller en publikt åtkomlig fil. Föredra kortlivad session/token i minnet och begär ny inloggning vid behov.
- Skilj privata användardata från styrelsens testversion. Synk är av som standard och måste aktiveras per användare.
- Börja med **endast läsning** från Drive; aldrig automatiska skrivningar eller raderingar i Sheets.

## Importlogik
1. Hämta endast relevanta celler via Google Sheets API för autentiserad användare.
2. Mappa varje rad till DX Starts befintliga loggformat: `date,time,freq,frequencyUnit,band,mode,rx,rxplace,station,country,place,lang,sinpo,signal,content,notes,verifyStatus,txHistory,placeHistory` osv.
3. Avvisa ogiltiga datum, tomma stationer, felaktiga frekvenser och ofullständiga rader till en separat felrapport. Bevara osäkra ID som osäkra.
4. Normalisera station, tid, frekvens, mottagare och mode. Beräkna en **stabil, deterministisk käll-ID** för varje Sheets-post (helst en unik loggpostnyckel i arket; radnummer ensamt är inte stabilt om man sorterar).
5. Matcha mot befintliga poster med DX Starts `dxNormalizeLog` och `dxMergeLogs`. Kör alltid förhandsvisning: antal nya, uppdaterade, oförändrade och konflikter.
6. Ändra aldrig lokala loggar innan säkerhetskopia av aktuell lokal data lyckats. Använd programmets befintliga transaktionella lagringsfunktion och rollback vid fel.
7. Inga dubbletter vid upprepad hämtning; ingen tyst överskrivning av lokala ändringar; bevara raderingsmarkeringar och revisionsdata.
8. Synka bara vid aktivt, inloggat fönster och efter tydligt samtycke. Pollning var 5:e minut är en möjlig senare inställning; ingen bakgrundsgaranti på stängd platta.

## Acceptanstest (ska göras före driftsättning)
- Radio Caroline 648 kHz, 2026-10-10 21:31 UTC, SK6WW hämtas exakt en gång.
- Samma hämtning två gånger ger 0 nya poster.
- Tidigare talkSPORT, COPE Madrid m.fl. finns kvar.
- Två stationer på samma frekvens men olika tid förblir separata.
- Felaktig/offline/inloggning utgången: tydligt fel, **ingen** dataförlust.
- Testperson utan behörighet kan inte läsa privata Sheets.
- Mobil, surfplatta, dator, Chrome och återöppnad PWA testas.
- Exportera backup före och efter och jämför loggantal och innehåll.

## Nästa arbete
1. Implementera en ren, isolerad Sheets-till-logg-mappare med enhetstester på anonymiserade exempeldata.
2. Konfigurera OAuth-klient på rätt Google-konto (ingen hemlighet i chatten).
3. Lägg en **separat testvy** i denna gren och testa med read-only behörighet.
4. Kodgranska och kör full regressionskontroll; först därefter föreslå ändring av publicerad version.

Denna fil innehåller **inga privata loggposter eller autentiseringsuppgifter**.
