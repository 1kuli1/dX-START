# DX Centralen – testplan före extern pilot
**Datum:** 9 oktober 2026  
**Omfattning:** DX Start, Receiver Hub, PDF-guider, Asta, relevanta delar av DX-OS och DX Centralen  
**Status:** Intern teknisk förberedelse genomförd; ännu **inte godkänd för allmän teststart**.

## Principer
- Ingen inloggning för att använda DX-programmet.
- Varje användare har sin egen lokala loggbok. Under pilotperioden fungerar **ingen automatisk Google Drive-synkning**.
- **Inga loggar får raderas, skrivas över eller centralinsamlas under tester utan användarens godkännande.**
- Ta en lokal JSON-säkerhetskopia innan varje nytt testpass och efter avslutad lyssning.
- Tester använder i första hand fiktiva testposter, inte känsliga personuppgifter.
- Externa SDR-mottagare och ChatGPT kräver internet; offline stöder endast cachade lokala sidor och loggboksfunktioner.

## Etapp A – internt acceptanstest (måste göras före tester bjuds in)
Testa i Chrome på Samsung Galaxy A52, Samsung Tab S9 och en Windows-dator:
- [ ] Öppna https://1kuli1.github.io/dX-START/ – kontrollera att sidans innehåll stämmer med senast publicerad version.
- [ ] Installera via Chrome **⋮ → Installera app** eller **Lägg till på startskärmen**; kontrollera egen ikon/start.
- [ ] Öppna och stäng appar/sidor. Kontrollera navigering och återgång utan överlappande verktyg.
- [ ] Öppna Receiver Hub, välj en mottagare, spara en favorit, ladda om och kontrollera att favoriten finns kvar.
- [ ] Testa kombinerat bandfilter + sökning + mina favoriter samt inga missvisande ”ONLINE”-löften.
- [ ] Skapa en lokal testlogg. Stäng appen helt, starta om och kontrollera att posten finns kvar.
- [ ] Hämta JSON-säkerhetskopia. Importera samma fil igen och kontrollera att inget dubbleras eller försvinner.
- [ ] Flytta JSON-filen **manuellt** till en annan enhet; kontrollera att posten kommer in där. Håll separata kopior.
- [ ] Kontrollera de fyra identifieringsnivåerna Preliminär, Osäker, Trolig och Bekräftad.
- [ ] Prova att öppna och ladda ned minst tre PDF-guider, därefter de återstående 26.
- [ ] Kontrollera Asta från programmet: ChatGPT öppnas externt, och frågan kopieras eller kan klistras in.
- [ ] Stäng nätverket efter att sidorna öppnats online; verifiera att cachade sidor och lokal loggbok fungerar. Kontrollera sedan att externa mottagare inte felaktigt påstås fungera offline.
- [ ] Kör skärmläsare/TalkBack, enbart tangentbord, förstoring 200–400 %, stora teckensnitt och högt kontrastläge.
- [ ] Kontrollera återställning från JSON efter avinstallation/återinstallation **endast på en enhet med sparad backup**. Rensa aldrig data i en skarp loggbok.

**Stoppa piloten vid något fel som kan förstöra eller tappa DX-loggar.**

## Etapp B – begränsad pilot, föreslagen period 4–8 veckor
Efter godkänd intern kontroll: 5–10 frivilliga testpersoner med nybörjare och erfarna DX-are.
- Varje testare får samma installationslänk, kort guide och instruktion för JSON-backup.
- Vecka 1: förstå start, öppna mottagare, volym, frekvens och waterfall.
- Vecka 2: skapa, hitta och återställa loggar; prova stationsidentifiering och Asta.
- Vecka 3–4: prova guider, avancerade band, kartfunktioner, mobil/platta/dator.
- Vid behov vecka 5–8: åtgärda upptäckta problem och låt testarna prova rättningarna.

### Felrapportmall
Kopiera och skicka till testledaren via överenskommen kanal:

```text
DX Centralen – felrapport
Datum/klockslag:
Enhet (mobil/platta/dator):
Webbläsare:
Sida/funktion:
Jag försökte:
Det hände:
Jag förväntade mig:
Kan felet upprepas? Ja/Nej:
Skärmbild (frivilligt, utan personuppgifter):
Har jag tagit JSON-backup? Ja/Nej:
```

Prioriteter: **A: dataförlust/säkerhet**, **B: blockerar kärnfunktion**, **C: användbarhet/tillgänglighet**, **D: önskemål**.

## Vad som fortfarande inte är godkänt
- [ ] Säker synkning från personliga loggböcker till Drive och mellan enheter.
- [ ] Kontroll av äldre Apps Script-deployment och behörigheter.
- [ ] Bekräftad driftsäkerhet för externa SDR-länkar i riktiga enheter.
- [ ] Komplett tillgänglighets- och rättslig genomgång.
- [ ] Stöd för automatisk preliminär SINPO, automatiska SWL-rapporter och full stationshistoria enligt projektkraven.
- [ ] Samordning av alla separata projekt inom **en** PWA:s installationsområde (GitHub Pages har i dag flera projektadresser).
- [ ] Praktisk verifiering av PWA-installation och offlinefunktion på Android och Windows.
- [ ] Samlad felhantering och versionering för pilotgruppen.

## Godkännandekriterier
1. Inga öppna dataförlust-/säkerhetsfel.
2. Alla kärnflöden (mottagare, logg, export, import, guidning) fungerar i Samsung-mobil, Samsung-platta och Windows.
3. Ett riktigt tangentbords- och skärmläsartest är godkänt.
4. Testarna kan installera och komma igång utan individuella ingrepp i koden.
5. All återstående begränsning är beskriven öppet.
6. Testledaren fattar särskilt beslut om extern pilotstart; dagens kodtester innebär inte ett automatiskt godkännande.

## Interna kontroller hittills
- 33 automatiserade eller simulerade kodkontroller 2026-10-09: **godkända**.
- Manifestet innehåller 192x192 och 512x512 PNG-ikoner samt rätt start- och scope-värden. Källkoden är sparad i GitHub.
- De publicerade sidorna kan inte fullständigt verifieras med tillgänglig fjärrkontroll. Installationsupplevelsen har därför **inte** markerats godkänd.

---

## Obligatoriskt användbarhetstest – två typer av användare

**Grundkrav för slutversionen:** Ingen behöver förstå vad SDR, kHz eller SINPO betyder för att genomföra sin första lyssning. Den som redan är DX-are måste kunna arbeta effektivt utan att tvingas igenom en nybörjarguide.

### Nybörjare (utan förkunskaper)
Testaren får endast länken till DX Centralen. Testledaren observerar och hjälper bara om testaren fastnar.
- [ ] Förstår direkt skillnaden mellan **Börja här** och **Jag kan redan DX**.
- [ ] Hittar installationsinstruktioner för sin enhet utan hjälp.
- [ ] Kan öppna Receiver Hub och en lämplig SDR-mottagare.
- [ ] Kan få igång ljudet eller förstå varför mottagaren är otillgänglig.
- [ ] Kan förklara vad en frekvens och en waterfall är med egna ord efter guiden.
- [ ] Kan spara sin första testlogg utan att uppfinna en stationsidentifiering.
- [ ] Kan hitta loggen igen och exportera en JSON-säkerhetskopia.
- [ ] Vet var hjälpen och Asta finns.

**Godkänd nybörjarupplevelse:** användaren slutför lyssna → förstå → logga → säkerhetskopiera utan att behöva personlig instruktion. Dokumentera varje punkt där testaren tvekar; ändra gränssnittet, inte bara instruktionstexten.

### Erfaren DX-are
Testaren öppnar **Expertvägen** och använder verkliga mottagare eller realistiska testdata.
- [ ] Kan öppna lämpligt band/mottagare direkt och spara en favorit.
- [ ] Kan använda CW/FT8, ljud eller kartverktyg när det passar arbetet, utan att navigera genom en kurs.
- [ ] Kan skapa en fullständig logg med frekvensenhet, UTC, SINPO, säkert/osäkert ID och separata historikfält.
- [ ] Kan skapa ett SWL-rapportutkast från ett bekräftat QSO utan automatisk utsändning.
- [ ] Kan importera eller exportera loggposter utan oavsiktlig dublett eller dataförlust.
- [ ] Kan ange minst **två konkreta funktioner** som skulle spara tid eller ge nytta i egen DX-verksamhet.
- [ ] Kan ange minst ett viktigaste saknat arbetsflöde eller en begränsning.

**Godkänd expertupplevelse:** de avancerade funktionerna är lätta att hitta och minst två av dem upplevs som praktiskt användbara. Samla både beröm och kritik utan att styra svaren.

**Guide i programmet:** [Kom igång med DX Centralen](kom-igang.html) har separata installation-, nybörjar- och expertavsnitt. Länkar finns på centralens startsida, i loggboken, i Receiver Hub och i DX Academy.

**Teststatus:** dessa användartester är planerade men ännu inte utförda på fysiska enheter.
