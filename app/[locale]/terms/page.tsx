"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useLocale } from "next-intl";

function TermsRo() {
  return (
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
          <p>1.1. Prezentul document („Termeni și Condiții”, denumit în continuare T&C) stabilește regulile de utilizare a platformei de rezervări auto disponibilă pe www.zettacarrental.com (denumită în continuare Site-ul), operată de Zetta Cars SRL, persoană juridică română, CUI 52480190, înregistrată în România (denumită în continuare Societatea). Scopul T&C este de a informa corect utilizatorii atât cu privire la serviciile de închiriere auto și transferuri cât și cu privire la utilizarea Site-ului.</p>
          <p>1.2. Accesarea Site-ului și/sau trimiterea unei cereri de rezervare implică acceptarea integrală a acestor T&C, precum și a legislației aplicabile din România.</p>
          <p>1.3. Prin navigarea pe Site și/sau prin efectuarea unei rezervări, declarați că ați citit, înțeles și agreat T&C și Politica de Confidențialitate.</p>
          <p>1.4. T&C se aplică pe durată nedeterminată. Societatea poate modifica unilateral conținutul lor, fără notificare prealabilă. Versiunea actualizată devine aplicabilă imediat ce este publicată pe Site. Recomandăm verificarea periodică a eventualelor actualizări.</p>
        </CardContent>
      </Card>

      {/* II. DESCRIEREA SERVICIILOR */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">II. DESCRIEREA SERVICIILOR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>2.1. Zetta Cars SRL oferă servicii de închiriere auto. Vehiculele sunt predate în stare tehnică bună și curățenie corespunzătoare (interior/exterior). Semnarea contractului de închiriere confirmă acordul dvs. cu T&C și cu Politica de Confidențialitate.</p>
          <p>2.2. Modelele afișate pe Site reprezintă gama de referință a flotei. Afișarea unui model nu garantează disponibilitatea la data aleasă. După trimiterea cererii, disponibilitatea este confirmată de un reprezentant Zetta Cars (telefon, e-mail sau WhatsApp).</p>
          <p>2.3. Trimiterea cererii pe Site constituie o solicitare de rezervare, nu o rezervare confirmată. Rezervarea devine confirmată numai după comunicarea expresă a acestui fapt din partea Societății și, în anumite situații, achitarea sumei solicitate (avans/garanție/asigurare).</p>
        </CardContent>
      </Card>

      {/* III. CONDIȚII GENERALE DE ÎNCHIRIERE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">III. CONDIȚII GENERALE DE ÎNCHIRIERE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>3.1. Taxele aplicabile (tarif de închiriere, asigurare SCDW, garanție, taxă de livrare/returnare, după caz) se achită în avans, fie la confirmare, fie la preluarea vehiculului. Perioada minimă de închiriere este de 1 (una) zi (24h), iar în perioade de vârf (Paște, Crăciun, Revelion și sezon estival – iunie-septembrie) perioada minimă poate fi de 3 (trei) zile.</p>
          <p>3.2. Conducătorul auto trebuie să aibă cel puțin 23 de ani și permis de conducere valabil de minimum 2 ani. În lipsa îndeplinirii acestor condiții, Societatea poate anula comanda fără alte consecințe asupra sa.</p>
          <p>3.3. Orice modificare a datelor contractuale (date de contact, perioadă, șoferi autorizați etc.) trebuie comunicată în scris în cel mult 24 de ore de la preluarea mașinii.</p>
          <p>3.4. În perioade aglomerate, Societatea poate solicita un avans de 10% din valoarea totală a închirierii. Avansul este nereturnabil dacă Clientul anulează sau nu se prezintă la data/ora/locul confirmate. Dacă s-a achitat integral la confirmare și Clientul anulează, Societatea reține 10% din valoarea totală a perioadei rezervate.</p>
          <p>3.5. Facturarea în RON se poate face la cursul de vânzare BNR + 1% din ziua semnării contractului, dacă părțile au convenit tarife în EUR.</p>
          <p>3.6. Pentru întârzieri la plată peste termenele contractuale, se pot percepe penalități de 3%/zi aplicate sumei datorate.</p>
          <p>3.7. În situații excepționale (cerere mare, evenimente neprevăzute – avarii, imobilizări tehnice), Societatea poate livra un vehicul similar clasei rezervate. Refuzul Clientului de a accepta alternativa nu conferă dreptul la rambursarea avansului.</p>
          <p>3.8. Vehiculul se returnează în stare similară cu cea de la predare, cu toate documentele și accesoriile primite, inclusiv cablul/încărcătorul pentru vehiculele plug-in hybrid (acolo unde este cazul). Rezervorul trebuie readus la nivelul de la preluare. Taxa de curățare se aplică doar în situațiile în care autovehiculul este returnat cu murdării semnificative care nu pot fi îndepărtate printr-o spălare uzuală și necesită proceduri de detailing profesional. Valoarea acestei taxe este de 10 EUR pentru clasele standard și 18 EUR pentru vehiculele premium sau mini-vanuri.</p>
          <p>3.9. În cazul în care autovehiculul este returnat cu întârziere față de ora stabilită în contract, fără ca această întârziere să fi fost convenită în prealabil de comun acord între Client și Societate, se poate aplica o taxă cuprinsă între 100 și 300 EUR, în funcție de clasa autovehiculului. Dacă întârzierea depășește 6 ore, Societatea își rezervă dreptul de a dispune măsuri suplimentare conform prevederilor legale și contractuale.</p>
          <p>3.10. Tariful standard include o medie de 200 km/zi. Kilometrii suplimentari se taxează cu 5–15 EUR / 50 km, în funcție de model/clasă. Combustibilul lipsă la returnare se taxează la 2,5 EUR/litru.</p>
          <p>3.11. Pierderea/distrugerea cheilor: 200–700 EUR. Pierderea/distrugerea documentelor: 100 EUR.</p>
          <p>3.12. Ieşirea din țară este permisă doar în state membre UE, cu notificare prealabilă și acordul Societății, implicând taxă de 50 EUR/ieșire (extindere teritoriu asigurări + împuterniciri).</p>
          <p>3.13. Costuri suplimentare (amenzi, taxă drum/parcare, pene, anvelope, reparații ca urmare a utilizării neconforme etc.) sunt în sarcina Clientului. Dacă vehiculul devine nefuncțional din vina Clientului și necesită transport pe platformă, Clientul suportă costul repatrierii la punctul de lucru indicat de Societate.</p>
        </CardContent>
      </Card>

      {/* IV. GARANȚIE DE ÎNCHIRIERE & ASIGURARE SCDW */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">IV. GARANȚIE DE ÎNCHIRIERE &amp; ASIGURARE SCDW</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>4.1. La preluare, Clientul achită sau acceptă blocarea unei garanții (depozit) sau optează pentru SCDW (Super Collision Damage Waiver), conform clasei și duratei. Restituirea garanției are loc la returnarea vehiculului în condiții corespunzătoare (stare, curățenie, accesorii, oră/loc), cu respectarea procedurilor de constatare.</p>
          <p>4.2. Varianta „Garanție” (fără SCDW): Societatea acoperă costul daunelor până la 3.000 EUR per eveniment; orice sumă peste 3.000 EUR este achitată de Client. În caz de daună totală, se aplică același plafon. Dacă vehiculul este returnat foarte murdar sau există suspiciuni de daune, restituirea garanției poate fi amânată până la finalizarea verificărilor și a evaluării.</p>
          <p>4.3. Varianta „SCDW”: SCDW este o protecție suplimentară oferită de Societate; Societatea acoperă costul daunelor până la 6.000 EUR per eveniment; orice sumă peste 6.000 EUR este achitată de Client; garanția se poate reduce la zero sau la un nivel minim operațional, conform clasei.</p>
          <p>4.4. Nici garanția, nici SCDW nu acoperă: combustibil, daune la anvelope/jante, partea inferioară (șasiu, baie ulei, cutie, bloc motor), utilizări abuzive/neglijență, pierderea accesoriilor (inclusiv cablul/încărcătorul PHEV), costuri cu lipsa de folosință, tractări generate de utilizare neconformă, încălcări legale. Protecțiile se aplică exclusiv conducătorilor înscriși în contract.</p>
        </CardContent>
      </Card>

      {/* V. OBLIGAȚIILE CLIENTULUI */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">V. OBLIGAȚIILE CLIENTULUI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>5.1. La preluare, Clientul verifică vehiculul și raportează imediat orice observații. Dacă apar semne de funcționare anormală pe parcurs, Clientul oprește deplasarea și contactează Societatea.</p>
          <p>5.2. Clientul se obligă, între altele, să:</p>
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
          <p>5.3. Pentru nerespectarea obligațiilor, Societatea poate reține avansuri, garanția și/sau sumele SCDW, după caz, în limita prevederilor contractuale și legale.</p>
        </CardContent>
      </Card>

      {/* VI. OBLIGAȚIILE SOCIETĂȚII */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">VI. OBLIGAȚIILE SOCIETĂȚII</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>6.1. Să predea Clientului dreptul de folosință asupra vehiculului prin: livrare, completare documente de predare-primire și înmânarea cheilor și actelor necesare (RCA, certificat înmatriculare).</p>
          <p>6.2. Să asigure asistență rutieră pe teritoriul României pe durata contractului, pentru accidente sau defecțiuni tehnice. Penele de cauciuc nu intră în responsabilitatea Societății.</p>
          <p>6.3. Societatea nu răspunde pentru pierderile suferite de Client din defectări/avarii, în afara cheltuielilor expres autorizate de Societate.</p>
          <p>6.4. Din momentul predării și până la returnare, Societatea este exonerată de răspundere pentru daunele provocate în trafic de vehiculul închiriat, taxe/amenzi, trecere pod, parcări abuzive etc.</p>
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
          <p>7.3. Două vehicule, vina Clientului: se completează constatare amiabilă dacă părțile cad de acord; în lipsa acordului, se solicită Proces-Verbal și Autorizație de Reparație.</p>
          <p>7.4. Două vehicule, fără vina Clientului: constatare amiabilă, dacă e posibil; se furnizează copii ale RCA, CI, permis și certificat înmatriculare ale părții vinovate; în lipsa acordului, se obțin PV și Autorizație de Reparație.</p>
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
          <p>8.1. Societatea nu răspunde pentru întârzieri ori neexecutare cauzate de forță majoră (cutremure, inundații, incendii, conflicte, greve, embargouri etc.). Vor fi depuse eforturi rezonabile pentru diminuarea efectelor și informarea clienților.</p>
          <p>8.2. Dacă forța majoră sau alte situații imprevizibile fac imposibilă executarea contractului, părțile sunt exonerate de răspundere, fără despăgubiri.</p>
        </CardContent>
      </Card>

      {/* IX. DREPTURI DE PROPRIETATE INTELECTUALĂ */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">IX. DREPTURI DE PROPRIETATE INTELECTUALĂ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>9.1. Conținutul Site-ului (texte, imagini, mărci, elemente grafice, baze de date etc.) aparține Societății și este protejat de legislația în vigoare.</p>
          <p>9.2. Este interzisă utilizarea/copierea/distribuirea/publicarea conținutului în scop comercial fără acordul scris al Societății.</p>
        </CardContent>
      </Card>

      {/* X. INFORMAȚII, SECURITATE & LINK-URI */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">X. INFORMAȚII, SECURITATE &amp; LINK-URI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>10.1. Utilizatorii declară că furnizează informații reale și complete.</p>
          <p>10.2. Orice încercare de fraudă (identități false, acces neautorizat, manipulare conținut, afectare performanță server etc.) duce la blocarea accesului și, după caz, sesizarea autorităților.</p>
          <p>10.3. Societatea nu poate fi ținută responsabilă pentru indisponibilități ale Site-ului, bug-uri sau alte probleme tehnice. Vor fi depuse eforturi rezonabile pentru funcționare normală, dar nu se garantează lipsa totală a erorilor.</p>
          <p>10.4. Site-ul poate conține link-uri către terți. Zetta Cars nu garantează conținutul/serviciile terților. Accesul se face pe riscul exclusiv al utilizatorului.</p>
        </CardContent>
      </Card>

      {/* XI. LITIGII */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">XI. LITIGII</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>11.1. Divergențele se soluționează pe cale amiabilă. În lipsa unei soluții, competența aparține instanțelor din Cluj-Napoca (dacă nu se prevede altfel prin lege).</p>
          <p>11.2. Legea aplicabilă: legea română.</p>
          <p>11.3. Clientul este de drept în întârziere pentru obligațiile neexecutate la termenele convenite.</p>
          <p>11.4. Prezentul document constituie probă între părți.</p>
        </CardContent>
      </Card>

      {/* XII. PREVEDERI FINALE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">XII. PREVEDERI FINALE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>12.1. T&C reprezintă contractul dintre consumator și Societate. Societatea poate cesiona contractul fără consimțământul Clientului, cu respectarea legii.</p>
          <p>12.2. Titlurile secțiunilor au rol orientativ și nu afectează interpretarea clauzelor.</p>
          <p>12.3. Dacă vreo clauză devine nulă/inaplicabilă, restul rămân valabile; clauza va fi înlocuită cu una care reflectă cât mai fidel intenția Societății.</p>
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
          <p>Adresă: Strada Partizanilor 32, Cluj-Napoca, Romania</p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Termeni și condiții actualizați ultima dată: 17 Noiembrie 2025</p>
        <p className="text-sm text-muted-foreground mt-2">Prin utilizarea serviciilor noastre, recunoașteți că ați citit și înțeles acești termeni și condiții.</p>
      </div>
    </div>
  );
}

function TermsEn() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold mb-2">TERMS AND CONDITIONS</h1>
        <p className="text-sm text-muted-foreground">Zetta Cars SRL (CUI 52480190)</p>
      </div>

      <Separator className="mb-8" />

      {/* I. GENERAL PROVISIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">I. GENERAL PROVISIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>1.1. This document (“Terms and Conditions”, hereinafter referred to as T&C) establishes the rules for using the car rental booking platform available on www.zettacarrental.com (hereinafter referred to as the Website), operated by Zetta Cars SRL, a Romanian legal entity, CUI 52480190, registered in Romania (hereinafter referred to as the Company). The purpose of the T&C is to properly inform users both about car rental and transfer services, as well as about the use of the Website.</p>
          <p>1.2. Accessing the Website and/or submitting a booking request implies full acceptance of these T&C, as well as the applicable legislation of Romania.</p>
          <p>1.3. By browsing the Website and/or making a reservation, you declare that you have read, understood, and agreed to the T&C and the Privacy Policy.</p>
          <p>1.4. The T&C apply for an indefinite period. The Company may unilaterally modify their content without prior notice. The updated version becomes applicable immediately upon publication on the Website. We recommend periodically checking for updates.</p>
        </CardContent>
      </Card>

      {/* II. DESCRIPTION OF SERVICES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">II. DESCRIPTION OF SERVICES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>2.1. Zetta Cars SRL provides car rental services. Vehicles are delivered in good technical condition and proper cleanliness (interior/exterior). Signing the rental contract confirms your agreement with the T&C and the Privacy Policy.</p>
          <p>2.2. The models displayed on the Website represent the reference range of the fleet. Displaying a model does not guarantee availability on the selected date. After submitting a request, availability is confirmed by a Zetta Cars representative (phone, email, or WhatsApp).</p>
          <p>2.3. Submitting a request on the Website constitutes a booking request, not a confirmed reservation. A reservation becomes confirmed only after explicit communication from the Company and, in certain cases (you will be informed by a Zetta Cars representative), after payment of the requested amount (advance/deposit/insurance).</p>
        </CardContent>
      </Card>

      {/* III. GENERAL RENTAL CONDITIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">III. GENERAL RENTAL CONDITIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>3.1. Applicable fees (rental rate, SCDW insurance, deposit, delivery/return fee, if applicable) are paid in advance, either upon confirmation or upon vehicle pick-up. The minimum rental period is 1 (one) day (24h), and during peak periods (Easter, Christmas, New Year, and summer season – June–September) the minimum period may be 3 (three) days.</p>
          <p>3.2. The driver must be at least 23 years old and hold a valid driving license for at least 2 years. If these conditions are not met, the Company may cancel the booking without further consequences.</p>
          <p>3.3. Any modification of contractual data (contact details, period, authorized drivers, etc.) must be communicated in writing within 24 hours of vehicle pick-up.</p>
          <p>3.4. During busy periods, the Company may require an advance payment of 10% of the total rental value. The advance is non-refundable if the Client cancels or fails to show up at the confirmed date/time/location. If full payment was made at confirmation and the Client cancels, the Company retains 10% of the total value.</p>
          <p>3.5. Invoicing in RON may be made at the BNR selling exchange rate + 1% on the day of contract signing, if the parties agreed on EUR rates.</p>
          <p>3.6. Late payments beyond contractual deadlines may incur penalties of 3% per day applied to the due amount.</p>
          <p>3.7. In exceptional situations (high demand, unforeseen events – breakdowns, technical immobilizations), the Company may deliver a similar class vehicle. Refusal to accept the alternative does not entitle the Client to a refund of the advance.</p>
          <p>3.8. The vehicle must be returned in a condition similar to that at delivery, with all documents and accessories received, including cable/charger for plug-in hybrid vehicles (where applicable). The fuel level must match that at pick-up. A cleaning fee applies only if the vehicle is returned with significant dirt requiring professional detailing (e.g., persistent stains, liquids, excessive sand or mud, embedded odors). Fee: 10 EUR for standard classes and 18 EUR for premium/minivans.</p>
          <p>3.9. If the vehicle is returned late without prior agreement, a fee between 100 and 300 EUR may apply, depending on the vehicle class. Delays exceeding 6 hours may lead to additional legal/contractual measures.</p>
          <p>3.10. The standard rate includes an average of 200 km/day. Extra kilometers are charged at 5–15 EUR / 50 km. Missing fuel is charged at 2.5 EUR/liter.</p>
          <p>3.11. Loss/damage of keys: 200–700 EUR. Loss/damage of documents: 100 EUR.</p>
          <p>3.12. Leaving the country is allowed only within EU member states, with prior notification and Company approval, subject to a 50 EUR fee.</p>
          <p>3.13. Additional costs (fines, road/parking taxes, tire issues, repairs due to improper use, etc.) are borne by the Client. If the vehicle becomes non-functional due to the Client’s fault, the Client covers repatriation costs.</p>
        </CardContent>
      </Card>

      {/* IV. RENTAL DEPOSIT & SCDW INSURANCE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">IV. RENTAL DEPOSIT &amp; SCDW INSURANCE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>4.1. Upon pick-up, the Client pays or authorizes blocking of a deposit or opts for SCDW. Refund is made after proper return and inspection.</p>
          <p>4.2. “Deposit” option (without SCDW):<br />
          – Company covers damages up to 3,000 EUR per event;<br />
          – amounts above are paid by the Client;<br />
          – same applies in case of total loss.</p>
          <p>4.3. “SCDW” option:<br />
          – additional protection;<br />
          – Company covers damages up to 6,000 EUR;<br />
          – amounts above are paid by the Client;<br />
          – deposit may be reduced or eliminated.</p>
          <p>4.4. Neither deposit nor SCDW covers: fuel, tire/rim damage, underbody damage, negligence, lost accessories, loss of use, improper towing, legal violations. Protections apply only to authorized drivers.</p>
        </CardContent>
      </Card>

      {/* V. CLIENT OBLIGATIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">V. CLIENT OBLIGATIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>5.1. The Client must inspect the vehicle at pick-up and report any issues immediately.</p>
          <p>5.2. The Client agrees to: respect traffic laws, not allow unauthorized drivers, not sub-rent, not use in competitions, not drive under influence, not use off-road, etc.</p>
          <p>5.3. Failure to comply may result in retention of advance/deposit/SCDW amounts.</p>
        </CardContent>
      </Card>

      {/* VI. COMPANY OBLIGATIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">VI. COMPANY OBLIGATIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>6.1. Provide the vehicle and necessary documents.</p>
          <p>6.2. Provide roadside assistance in Romania.</p>
          <p>6.3. Not liable for indirect losses.</p>
          <p>6.4. Not responsible for fines/damages during rental period.</p>
        </CardContent>
      </Card>

      {/* VII. ACCIDENT/DAMAGE PROCEDURE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">VII. ACCIDENT/DAMAGE PROCEDURE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Client must notify immediately, obtain proper documents (amicable report, police report, repair authorization), and follow all legal procedures. Failure leads to liability for all costs.</p>
        </CardContent>
      </Card>

      {/* VIII. FORCE MAJEURE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">VIII. FORCE MAJEURE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Company is not liable for delays caused by force majeure events.</p>
        </CardContent>
      </Card>

      {/* IX. INTELLECTUAL PROPERTY */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">IX. INTELLECTUAL PROPERTY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Website content belongs to the Company and cannot be used without consent.</p>
        </CardContent>
      </Card>

      {/* X. INFORMATION, SECURITY & LINKS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">X. INFORMATION, SECURITY &amp; LINKS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Users must provide accurate information. Fraud attempts lead to access restriction and possible legal action. The Company is not responsible for technical issues or third-party links.</p>
        </CardContent>
      </Card>

      {/* XI. DISPUTES */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">XI. DISPUTES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Disputes are resolved amicably or by courts in Cluj-Napoca under Romanian law.</p>
        </CardContent>
      </Card>

      {/* XII. FINAL PROVISIONS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">XII. FINAL PROVISIONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>T&C represent the contract between the Client and the Company. Invalid clauses do not affect the rest.</p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Contact Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Zetta Cars S.R.L.</strong> (CUI 52480190)</p>
          <p>Email: <Link href="mailto:contact@zettacarrental.com" className="text-primary hover:underline">contact@zettacarrental.com</Link></p>
          <p>Phone: +40750250121</p>
          <p>Address: Strada Partizanilor 32, Cluj-Napoca, Romania</p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Terms and conditions last updated: November 17, 2025</p>
        <p className="text-sm text-muted-foreground mt-2">By using our services, you acknowledge that you have read and understood these terms and conditions.</p>
      </div>
    </div>
  );
}

export default function TermsAndConditionsPage() {
  const locale = useLocale();

  return (
    <PageLayout>
      {locale === 'ro' ? <TermsRo /> : <TermsEn />}
    </PageLayout>
  );
}
