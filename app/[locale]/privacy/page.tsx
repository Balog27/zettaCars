import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-bold mb-2">NOTĂ DE INFORMARE PRIVIND PRELUCRAREA DATELOR CU CARACTER PERSONAL</h1>
          <p className="text-sm text-muted-foreground">Zetta Cars SRL (CUI 52480190)</p>
        </div>

        <Separator className="mb-8" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">1. Informații generale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Protejarea datelor dumneavoastră cu caracter personal reprezintă o prioritate pentru noi. Societatea ZETTA CARS S.R.L.
              (denumită în continuare „Societatea” sau „noi”) respectă principiile prevăzute de Regulamentul (UE) 2016/679 privind
              protecția datelor cu caracter personal („GDPR") și acționează în calitate de operator atunci când prelucrează datele
              dumneavoastră.
            </p>
            <p>
              Pentru orice întrebări referitoare la modul în care sunt gestionate datele personale, ne puteți contacta la:
            </p>
            <ul>
              <li>Email: <Link href="mailto:contact@zettacarrental.com" className="text-primary hover:underline">contact@zettacarrental.com</Link></li>
              <li>Telefon: +40750250121</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">2. Situațiile în care colectăm datele dumneavoastră</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Datele cu caracter personal sunt colectate în diferite situații, cum ar fi:</p>
            <ul>
              <li>când ne contactați pentru informații despre serviciile de închiriere (prin e-mail, telefon, website etc.);</li>
              <li>când reprezentați o persoană juridică ce colaborează sau dorește să colaboreze cu Societatea;</li>
              <li>când utilizați efectiv serviciile noastre de închiriere auto;</li>
              <li>când vizitați sau navigați pe website-ul nostru;</li>
              <li>când comunicați cu noi prin rețelele sociale sau alte canale de contact.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">3. Scopurile prelucrării</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Datele personale pot fi utilizate în următoarele scopuri:</p>
            <ul>
              <li>pentru a permite contactul și inițierea unei colaborări atunci când solicitați informații despre serviciile noastre;</li>
              <li>pentru gestionarea și derularea contractelor de închiriere auto sau a relațiilor comerciale existente;</li>
              <li>pentru îndeplinirea obligațiilor legale ce ne revin (de exemplu, fiscale sau contabile);</li>
              <li>pentru protejarea intereselor noastre legitime (de exemplu, siguranța bunurilor, prevenirea fraudelor, apărarea drepturilor noastre în instanță);</li>
              <li>pentru comunicări legate de serviciile oferite, în limitele legale și cu respectarea drepturilor dumneavoastră.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">4. Categoriile de date prelucrate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>În funcție de scopul interacțiunii, putem prelucra următoarele tipuri de date:</p>
            <ul>
              <li><strong>Date de identificare:</strong> nume, prenume, CNP, seria și numărul actului de identitate, adresa de domiciliu, data nașterii, informații din permisul de conducere (număr, categorie, valabilitate);</li>
              <li><strong>Date de contact:</strong> număr de telefon, adresă de e-mail;</li>
              <li><strong>Date legate de rezervare:</strong> locația de preluare și returnare, datele și orele de închiriere, informații legate de autovehiculul ales.</li>
            </ul>
            <p>Societatea nu colectează și nu prelucrează intenționat date sensibile (precum origine etnică, opinii politice, convingeri religioase, date biometrice, informații privind sănătatea sau orientarea sexuală).</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">5. Temeiurile legale ale prelucrării</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Prelucrarea datelor dumneavoastră se bazează pe:</p>
            <ul>
              <li>executarea unui contract sau a unor demersuri precontractuale (în cazul rezervărilor și închirierilor auto);</li>
              <li>îndeplinirea obligațiilor legale (de exemplu, cele contabile, fiscale sau impuse de autorități);</li>
              <li>interesul legitim al Societății, cum ar fi protejarea bunurilor proprii și prevenirea abuzurilor, apărarea drepturilor în fața instanțelor, îmbunătățirea serviciilor;</li>
              <li>consimțământul explicit al dumneavoastră, acolo unde este necesar (de exemplu, pentru comunicări de marketing).</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">6. Destinatarii datelor personale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Datele dumneavoastră pot fi comunicate, atunci când este necesar, următoarelor categorii de destinatari:</p>
            <ul>
              <li>furnizorilor implicați în procesul de închiriere (ex: servicii de mentenanță, plăți, platforme online etc.);</li>
              <li>autorităților publice, atunci când suntem obligați legal;</li>
              <li>consultanților noștri externi: contabili, auditori, avocați, experți tehnici sau fiscali.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">7. Date colectate automat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Prin accesarea website-ului, anumite informații pot fi colectate automat prin cookie-uri sau tehnologii similare (de exemplu, adresa IP, tipul browserului, durata vizitei).</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">8. Perioada de păstrare a datelor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Păstrăm datele personale doar pe durata necesară îndeplinirii scopurilor pentru care au fost colectate, cu respectarea obligațiilor legale și a intereselor legitime.</p>
            <p>Ca regulă generală:</p>
            <ul>
              <li>dacă o rezervare este anulată, datele sunt păstrate maximum 2 zile de la anulare;</li>
              <li>dacă a fost încheiat un contract, datele sunt păstrate până la 360 de zile după returnarea autovehiculului;</li>
              <li>dacă legea impune termene mai lungi (de exemplu, pentru arhivare fiscală), acestea vor fi respectate.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">9. Transferul datelor în afara României</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Datele dumneavoastră pot fi transferate către state din Uniunea Europeană sau Spațiul Economic European. Dacă, în situații excepționale, transferul are loc către o țară din afara UE/SEE, acesta se va realiza doar în baza unor garanții adecvate (cum ar fi clauzele contractuale standard aprobate de Comisia Europeană). Veți fi informat înainte de orice astfel de transfer.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">10. Securitatea datelor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Aplicăm măsuri tehnice și organizatorice stricte pentru protejarea datelor împotriva pierderii, accesului neautorizat sau distrugerii. În cazul unui incident de securitate ce ar putea afecta drepturile dumneavoastră, vă vom informa fără întârziere, dar nu mai târziu de 72 de ore, conform obligațiilor legale.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">11. Modificarea prezentei informări</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Această notă de informare poate fi actualizată periodic pentru a reflecta modificări legislative sau operaționale. Orice versiune revizuită va fi publicată pe website, iar în cazuri importante vă vom notifica prin e-mail sau printr-un mesaj vizibil pe platformă.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">12. Drepturile dumneavoastră</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>În calitate de persoană vizată, beneficiați de următoarele drepturi:</p>
            <ul>
              <li>Dreptul de retragere a consimțământului – puteți oricând să vă retrageți acordul pentru prelucrările bazate pe consimțământ, fără a afecta legalitatea celor efectuate anterior.</li>
              <li>Dreptul de acces – puteți solicita informații despre datele pe care le deținem și scopul prelucrării.</li>
              <li>Dreptul la rectificare – aveți dreptul de a cere corectarea datelor inexacte sau incomplete.</li>
              <li>Dreptul la ștergere („dreptul de a fi uitat”) – puteți solicita ștergerea datelor atunci când acestea nu mai sunt necesare, v-ați retras consimțământul sau au fost prelucrate ilegal.</li>
              <li>Dreptul la restricționarea prelucrării – puteți solicita limitarea utilizării datelor în anumite situații.</li>
              <li>Dreptul la portabilitate – puteți solicita transferul datelor către dumneavoastră sau către un alt operator, într-un format electronic standardizat.</li>
              <li>Dreptul la opoziție – vă puteți opune prelucrării bazate pe interes legitim sau pe o sarcină de interes public.</li>
              <li>Dreptul de a formula o plângere – dacă considerați că drepturile v-au fost încălcate, puteți sesiza ANSPDCP sau instanțele competente.</li>
            </ul>
            <p>Pentru exercitarea acestor drepturi sau pentru orice alte solicitări privind protecția datelor, ne puteți contacta la datele de contact menționate în secțiunea 1.</p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

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

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Notă de informare actualizată la data de: 20.04.2025</p>
        </div>
      </div>
    </PageLayout>
  );
}
