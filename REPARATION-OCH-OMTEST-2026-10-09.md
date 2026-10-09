# DX Centralen 7.30 – rättningar och omtest

De återstående loggfelen skyddas nu: korrupt Katastrof-DX-data får inte skrivas över, huvudloggbokens export stoppar vid läsfel, och en uttrycklig återställning bevarar tidigare rådata separat. Radering använder ett stabilt logg-ID. Web Locks samordnar huvudloggbokens och DX-OS skrivningar. En webbläsare utan Web Locks får läsa/exportera men inte skriva.

Excel-import läser frekvensenhet per rad, tar med längre historikrubriker och skiljer mellan mode. Amatörloggar med generisk frekvenskolumn måste ha enhet; oklar enhet gissas inte. Bandbyten, koordinater, SWL-enheter och CSV-export är rättade. Den trasiga Academy-AI-sidan fungerar igen. Äldre kursloggboken bevarar frekvensen och påstår inte 95 % säker identifiering från musikstil. Användartext HTML-escapas. Mikrofonspår stoppas efter inspelning. Oansluten kod för egna mottagare har tagits bort.

Katastrof-DX har egen återimport. Den gamla DX-system-adressen hänvisar till samma reparerade sida och använder samma lokala lagring. DX-OS saknade ljudmodul och felstavade tillbaka-länk är rättade. För Borgwedel erbjuds KiwiSDR-katalogen i stället för den gamla 404-adressen. Övriga externa tjänster kräver praktisk kontroll; tillgänglighet kan variera.

## Verifiering

- Tidigare svit: 23 godkända kontroller.
- Nya DOM-/säkerhetskontroller: 18 för huvudprogrammet, plus två för DX-OS i den lokala granskningen.
- Samtliga 43 huvudprogrammets HTML-sidor laddade i jsdom, samt alla tio verktygsvyer öppnade.
- JSON-rundtur, återställning från korrupt data, utrymmesfel, konkurrerande sparningar, stabil radering, tombstones, Excel-enhet/historik/mode, kartkoordinater, CSV, SWL, HTML-utskrift och mikrofonstopp provade med fiktiva testdata.
- 93 HTML-sidor och 237 lokala referenser granskade: inga saknade filer/ankare eller dubbla ID:n.
- JavaScript-syntax kontrollerad i alla fyra projekten.

Testmiljön använder jsdom och simulerade webbläsar-API:er. Den verifierar programlogik och DOM, inte faktisk installation, skärmläsare, mobilrendering, riktig mikrofon eller radioljud. Praktiska tester på A52, Tab S9 och Windows återstår. Automatisk Drive-synk är fortsatt avstängd. Inga nya lektioner har tillkommit, och inga privata loggar har ändrats eller publicerats.

Kör fortlöpande kontroller med `npm ci --ignore-scripts` och `npm test`. GitHub Actions kör båda testsviterna.
