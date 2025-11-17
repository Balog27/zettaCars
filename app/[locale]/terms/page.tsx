import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-bold mb-2">TERMENI ȘI CONDIȚII</h1>
          <p className="text-sm text-muted-foreground">Zetta Cars SRL (CUI 52480190)</p>
        </div>

        <Separator className="mb-8" />

        {/* I. DISPOZIȚII GENERALE */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">I. DISPOZIȚII GENERALE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              1.1. Prezentul document („Termeni și Condiții”, denumit în continuare T&C) stabilește regulile de utilizare a
              platformei de rezervări auto disponibilă pe www.zettacarrental.com (denumită în continuare Site-ul), operată de
              Zetta Cars SRL, persoană juridică română, CUI 52480190, înregistrată în România (denumită în continuare Societatea).
              Scopul T&C este de a informa corect utilizatorii atât cu privire la serviciile de închiriere auto și transferuri cât și cu
              privire la utilizarea Site-ului.
            </p>
            <p>
              1.2. Accesarea Site-ului și/sau trimiterea unei cereri de rezervare implică acceptarea integrală a acestor T&C, precum
              și a legislației aplicabile din România.
            </p>
            <p>
              1.3. Prin navigarea pe Site și/sau prin efectuarea unei rezervări, declarați că ați citit, înțeles și agreat T&C și Politica
              de Confidențialitate.
            </p>
            <p>
              1.4. T&C se aplică pe durată nedeterminată. Societatea poate modifica unilateral conținutul lor, fără notificare
              prealabilă. Versiunea actualizată devine aplicabilă imediat ce este publicată pe Site. Recomandăm verificarea
              periodică a eventualelor actualizări.
            </p>
          </CardContent>
        </Card>

        {/* II. DESCRIEREA SERVICIILOR */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">II. DESCRIEREA SERVICIILOR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              2.1. Zetta Cars SRL oferă servicii de închiriere auto. Vehiculele sunt predate în stare tehnică bună și curățenie
              corespunzătoare (interior/exterior). Semnarea contractului de închiriere confirmă acordul dvs. cu T&C și cu
              Politica de Confidențialitate.
            </p>
            <p>
              2.2. Modelele afișate pe Site reprezintă gama de referință a flotei. Afișarea unui model nu garantează disponibilitatea
              la data aleasă. După trimiterea cererii, disponibilitatea este confirmată de un reprezentant Zetta Cars (telefon,
              e-mail sau WhatsApp).
            </p>
            <p>
              2.3. Trimiterea cererii pe Site constituie o solicitare de rezervare, nu o rezervare confirmată. Rezervarea devine
              confirmată numai după comunicarea expresă a acestui fapt din partea Societății și, în anumite situații, achitarea sumei
              solicitate (avans/garanție/asigurare).
            </p>
          </CardContent>
        </Card>

        {/* III. CONDIȚII GENERALE DE ÎNCHIRIERE */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">III. CONDIȚII GENERALE DE ÎNCHIRIERE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              3.1. Taxele aplicabile (tarif de închiriere, asigurare SCDW, garanție, taxă de livrare/returnare, după caz) se
              achită în avans, fie la confirmare, fie la preluarea vehiculului. Perioada minimă de închiriere este de 1 (una)
              zi (24h), iar în perioade de vârf (Paște, Crăciun, Revelion și sezon estival – iunie-septembrie) perioada minimă
              poate fi de 3 (trei) zile.
            </p>
            <p>
              3.2. Conducătorul auto trebuie să aibă cel puțin 23 de ani și permis de conducere valabil de minimum 2 ani. În
              lipsa îndeplinirii acestor condiții, Societatea poate anula comanda fără alte consecințe asupra sa.
            </p>
            <p>
              3.3. Orice modificare a datelor contractuale (date de contact, perioadă, șoferi autorizați etc.) trebuie comunicată
              în scris în cel mult 24 de ore de la preluarea mașinii.
            </p>
            <p>
              3.4. În perioade aglomerate, Societatea poate solicita un avans de 10% din valoarea totală a închirierii. Avansul este
              nereturnabil dacă Clientul anulează sau nu se prezintă la data/ora/locul confirmate. Dacă s-a achitat integral la
              confirmare și Clientul anulează, Societatea reține 10% din valoarea totală a perioadei rezervate.
            </p>
            <p>
              3.5. Facturarea în RON se poate face la cursul de vânzare BNR + 1% din ziua semnării contractului, dacă părțile au
              convenit tarife în EUR.
            </p>
            <p>
              3.6. Pentru întârzieri la plată peste termenele contractuale, se pot percepe penalități de 3%/zi aplicate sumei
              datorate.
            </p>
            <p>
              3.7. În situații excepționale (cerere mare, evenimente neprevăzute – avarii, imobilizări tehnice), Societatea poate
              livra un vehicul similar clasei rezervate. Refuzul Clientului de a accepta alternativa nu conferă dreptul la
              rambursarea avansului.
            </p>
            <p>
              3.8. Vehiculul se returnează în stare similară cu cea de la predare, cu toate documentele și accesoriile primite,
              inclusiv cablul/încărcătorul pentru vehiculele plug-in hybrid (acolo unde este cazul). Rezervorul trebuie
              readus la nivelul de la preluare. Taxa de curățare se aplică doar în situațiile în care autovehiculul este returnat
              cu murdării semnificative care nu pot fi îndepărtate printr-o spălare uzuală și necesită proceduri de detailing
              profesional. Valoarea acestei taxe este de 10 EUR pentru clasele standard și 18 EUR pentru vehiculele premium
              sau mini-vanuri.
            </p>
            <p>
              3.9. În cazul în care autovehiculul este returnat cu întârziere față de ora stabilită în contract, fără ca această
              întârziere să fi fost convenită în prealabil de comun acord între Client și Societate, se poate aplica o taxă
              cuprinsă între 100 și 300 EUR, în funcție de clasa autovehiculului. Dacă întârzierea depășește 6 ore,
              Societatea își rezervă dreptul de a dispune măsuri suplimentare conform prevederilor legale și contractuale.
            </p>
            <p>
              3.10. Tariful standard include o medie de 200 km/zi. Kilometrii suplimentari se taxează cu 5–15 EUR / 50 km,
              în funcție de model/clasă. Combustibilul lipsă la returnare se taxează la 2,5 EUR/litru.
            </p>
            <p>
              3.11. Pierderea/distrugerea cheilor: 200–700 EUR. Pierderea/distrugerea documentelor: 100 EUR.
            </p>
            <p>
              3.12. Ieşirea din țară este permisă doar în state membre UE, cu notificare prealabilă și acordul Societății,
              implicând taxă de 50 EUR/ieșire (extindere teritoriu asigurări + împuterniciri).
            </p>
            <p>
              3.13. Costuri suplimentare (amenzi, taxă drum/parcare, pene, anvelope, reparații ca urmare a utilizării neconforme
              etc.) sunt în sarcina Clientului. Dacă vehiculul devine nefuncțional din vina Clientului și necesită transport pe
              platformă, Clientul suportă costul repatrierii la punctul de lucru indicat de Societate.
            </p>
          </CardContent>
        </Card>

        {/* IV. GARANȚIE DE ÎNCHIRIERE & ASIGURARE SCDW */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">IV. GARANȚIE DE ÎNCHIRIERE &amp; ASIGURARE SCDW</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              4.1. La preluare, Clientul achită sau acceptă blocarea unei garanții (depozit) sau optează pentru SCDW
              (Super Collision Damage Waiver), conform clasei și duratei. Restituirea garanției are loc la returnarea
              vehiculului în condiții corespunzătoare (stare, curățenie, accesorii, oră/loc), cu respectarea procedurilor de
              constatare.
            </p>
            <p>
              4.2. Varianta „Garanție” (fără SCDW): Societatea acoperă costul daunelor până la 3.000 EUR per eveniment; orice
              sumă peste 3.000 EUR este achitată de Client. În caz de daună totală, se aplică același plafon. Dacă vehiculul
              este returnat foarte murdar sau există suspiciuni de daune, restituirea garanției poate fi amânată până la
              finalizarea verificărilor și a evaluării.
            </p>
            <p>
              4.3. Varianta „SCDW”: SCDW este o protecție suplimentară oferită de Societate; Societatea acoperă costul daunelor
              până la 6.000 EUR per eveniment; orice sumă peste 6.000 EUR este achitată de Client; garanția se poate reduce la
              zero sau la un nivel minim operațional, conform clasei.
            </p>
            <p>
              4.4. Nici garanția, nici SCDW nu acoperă: combustibil, daune la anvelope/jante, partea inferioară (șasiu, baie ulei,
              cutie, bloc motor), utilizări abuzive/neglijență, pierderea accesoriilor (inclusiv cablul/încărcătorul PHEV), costuri
              cu lipsa de folosință, tractări generate de utilizare neconformă, încălcări legale. Protecțiile se aplică exclusiv
              conducătorilor înscriși în contract.
            </p>
          </CardContent>
        </Card>

        {/* V. OBLIGAȚIILE CLIENTULUI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">V. OBLIGAȚIILE CLIENTULUI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              5.1. La preluare, Clientul verifică vehiculul și raportează imediat orice observații. Dacă apar semne de
              funcționare anormală pe parcurs, Clientul oprește deplasarea și contactează Societatea.
            </p>
            <p>
              5.2. Clientul se obligă, între altele, să:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>a) respecte legislația rutieră;</li>
              <li>b) anunțe și obțină acordul scris al Societății pentru ieșirea din țară;</li>
              <li>c) nu permită conducerea de către persoane neînscrise în contract;</li>
              <li>d) nu subînchirieze vehiculul;</li>
              <li>e) nu depășească sarcina/numărul de locuri prevăzute;</li>
              <li>f) nu folosească vehiculul în competiții/teste;</li>
              <li>g) efectueze reparații doar în service-uri agreate de Societate;</li>
              <li>h) păstreze vehiculul încuiat și în siguranță (fără chei la vedere);</li>
              <li>i) circule doar pe drumuri publice deschise traficului;</li>
              <li>j) nu tracteze/împingă alte vehicule;</li>
              <li>k) nu conducă sub influența alcoolului/drogurilor/medicației incompatibile;</li>
              <li>l) prezinte la preluare permisul valabil și act de identitate în original;</li>
              <li>m) nu utilizeze pe drumuri neamenajate/nepavate sau închise circulației;</li>
              <li>n) nu intervină tehnic/estetic fără acord scris;</li>
              <li>o) comunice, la cerere, locația vehiculului și să permită inspecția în max. 12 ore;</li>
              <li>p) nu utilizeze în scopuri comerciale neautorizate (taximetrie, ride-sharing, școală de șoferi etc.) sau activități ilegale;</li>
              <li>q) mențină starea vehiculului și suporte costurile reparațiilor pentru daune apărute pe durata contractului.</li>
            </ul>
            <p>
              5.3. Pentru nerespectarea obligațiilor, Societatea poate reține avansuri, garanția și/sau sumele SCDW, după caz,
              în limita prevederilor contractuale și legale.
            </p>
          </CardContent>
        </Card>

        {/* VI. OBLIGAȚIILE SOCIETĂȚII */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">VI. OBLIGAȚIILE SOCIETĂȚII</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              6.1. Să predea Clientului dreptul de folosință asupra vehiculului prin: livrare, completare documente de
              predare-primire și înmânarea cheilor și actelor necesare (RCA, certificat înmatriculare).
            </p>
            <p>
              6.2. Să asigure asistență rutieră pe teritoriul României pe durata contractului, pentru accidente sau defecțiuni
              tehnice. Penele de cauciuc nu intră în responsabilitatea Societății.
            </p>
            <p>
              6.3. Societatea nu răspunde pentru pierderile suferite de Client din defectări/avarii, în afara cheltuielilor
              expres autorizate de Societate.
            </p>
            <p>
              6.4. Din momentul predării și până la returnare, Societatea este exonerată de răspundere pentru daunele
              provocate în trafic de vehiculul închiriat, taxe/amenzi, trecere pod, parcări abuzive etc.
            </p>
          </CardContent>
        </Card>

        {/* VII. PROCEDURĂ ÎN CAZ DE AVARII/ACCIDENTE */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">VII. PROCEDURĂ ÎN CAZ DE AVARII/ACCIDENTE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>7.1. Clientul anunță imediat Societatea la constatarea oricărei avarii.</p>
            <p>7.2. Autor necunoscut: Clientul obține Autorizație de Reparație de la autorități.</p>
            <p>
              7.3. Două vehicule, vina Clientului: se completează constatare amiabilă dacă părțile cad de acord; în lipsa
              acordului, se solicită Proces-Verbal și Autorizație de Reparație.
            </p>
            <p>
              7.4. Două vehicule, fără vina Clientului: constatare amiabilă, dacă e posibil; se furnizează copii ale RCA, CI,
              permis și certificat înmatriculare ale părții vinovate; în lipsa acordului, se obțin PV și Autorizație de Reparație.
            </p>
            <p>7.5. Peste două vehicule sau vătămări corporale: contactați imediat autoritățile pentru PV și Autorizație de Reparație.</p>
            <p>7.6. Impact cu animale: notificare imediată a autorităților și Societății.</p>
            <p>7.7. Clientul verifică exactitatea tuturor documentelor (amiabilă, PV, Autorizație).</p>
            <p>7.8. Nerespectarea procedurii atrage răspunderea Clientului pentru costurile reparațiilor, imobilizare și lipsă de folosință.</p>
            <p>7.9. Orice daună apărută pe durata închirierii poate fi facturată (inclusiv zgârieturi minore).</p>
          </CardContent>
        </Card>

        {/* VIII. FORȚA MAJORĂ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">VIII. FORȚA MAJORĂ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              8.1. Societatea nu răspunde pentru întârzieri ori neexecutare cauzate de forță majoră (cutremure, inundații,
              incendii, conflicte, greve, embargouri etc.). Vor fi depuse eforturi rezonabile pentru diminuarea efectelor și
              informarea clienților.
            </p>
            <p>
              8.2. Dacă forța majoră sau alte situații imprevizibile fac imposibilă executarea contractului, părțile sunt
              exonerate de răspundere, fără despăgubiri.
            </p>
          </CardContent>
        </Card>

        {/* IX. DREPTURI DE PROPRIETATE INTELECTUALĂ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">IX. DREPTURI DE PROPRIETATE INTELECTUALĂ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              9.1. Conținutul Site-ului (texte, imagini, mărci, elemente grafice, baze de date etc.) aparține Societății și este
              protejat de legislația în vigoare.
            </p>
            <p>
              9.2. Este interzisă utilizarea/copierea/distribuirea/publicarea conținutului în scop comercial fără acordul scris al Societății.
            </p>
          </CardContent>
        </Card>

        {/* X. INFORMAȚII, SECURITATE & LINK-URI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">X. INFORMAȚII, SECURITATE &amp; LINK-URI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              10.1. Utilizatorii declară că furnizează informații reale și complete.
            </p>
            <p>
              10.2. Orice încercare de fraudă (identități false, acces neautorizat, manipulare conținut, afectare performanță server etc.) duce la blocarea accesului și, după caz, sesizarea autorităților.
            </p>
            <p>
              10.3. Societatea nu poate fi ținută responsabilă pentru indisponibilități ale Site-ului, bug-uri sau alte probleme tehnice. Vor fi depuse eforturi rezonabile pentru funcționare normală, dar nu se garantează lipsa totală a erorilor.
            </p>
            <p>
              10.4. Site-ul poate conține link-uri către terți. Zetta Cars nu garantează conținutul/serviciile terților. Accesul se face pe riscul exclusiv al utilizatorului.
            </p>
          </CardContent>
        </Card>

        {/* XI. LITIGII */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">XI. LITIGII</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              11.1. Divergențele se soluționează pe cale amiabilă. În lipsa unei soluții, competența aparține instanțelor din Cluj-Napoca (dacă nu se prevede altfel prin lege).
            </p>
            <p>11.2. Legea aplicabilă: legea română.</p>
            <p>
              11.3. Clientul este de drept în întârziere pentru obligațiile neexecutate la termenele convenite.
            </p>
            <p>11.4. Prezentul document constituie probă între părți.</p>
          </CardContent>
        </Card>

        {/* XII. PREVEDERI FINALE */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">XII. PREVEDERI FINALE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              12.1. T&C reprezintă contractul dintre consumator și Societate. Societatea poate cesiona contractul fără consimțământul Clientului, cu respectarea legii.
            </p>
            <p>
              12.2. Titlurile secțiunilor au rol orientativ și nu afectează interpretarea clauzelor.
            </p>
            <p>
              12.3. Dacă vreo clauză devine nulă/inaplicabilă, restul rămân valabile; clauza va fi înlocuită cu una care reflectă cât mai fidel intenția Societății.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Informații de Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Zetta Cars S.R.L.</strong> (CUI 52480190)</p>
            <p>Email: <Link href="mailto:contact@zettacarrental.com" className="text-primary hover:underline">contact@zettacarrental.com</Link></p>
            <p>Telefon: +40750250121</p>
            <p>Adresă: Cluj "Avram Iancu" International Airport, Strada Traian Vuia 149-151, Cluj-Napoca, România</p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Termeni și condiții actualizați ultima dată: 17 Noiembrie 2025</p>
          <p className="text-sm text-muted-foreground mt-2">Prin utilizarea serviciilor noastre, recunoașteți că ați citit și înțeles acești termeni și condiții.</p>
        </div>
      </div>
    </PageLayout>
  );
}
