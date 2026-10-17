import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Korisnik } from '../../modeli/Korisnik';

@Component({
  selector: 'app-registracija',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './registracija.html',
  styleUrl: './registracija.css',
})
export class Registracija implements OnInit{
  ngOnInit(): void {

    this.korisnickaImena=[]
    this.mejlovi=[]
    this.pibovi=[]
    this.maticniBrojevi=[]
    this.userServis.korisnickaImena().subscribe(data=>{
      if(data){
        data.forEach(ime=>{
          this.korisnickaImena.push(ime)
        })
      }
    })

     this.userServis.mejlovi().subscribe(data=>{
      if(data){
        data.forEach(mejl=>{
          this.mejlovi.push(mejl)
        })
      }
    })

     this.userServis.maticniBrojevi().subscribe(data=>{
      if(data){
        data.forEach(mb=>{
          this.maticniBrojevi.push(mb)
        })
      }
    })

     this.userServis.pibovi().subscribe(data=>{
      if(data){
        data.forEach(pib=>{
          this.pibovi.push(pib)
        })
      }
    })
  }

  korisnickaImena:String[]=[]
  mejlovi:String[]=[]
  pibovi:String[]=[]
  maticniBrojevi:String[]=[]

 http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)

korisnicko_ime=""
lozinka=""
ime=""
prezime=""
telefon=""
mejl=""
profilna=""
tip="klijent"
podtip="fizicko_lice"
izabranaProfilna:File|null=null
//pravna lica + stamparije
tipRegistracije="fizicko_lice"

odobren=false
naziv_institucije=""
adresa_sedista=""
grad=""
maticni_broj=""
pib=""

porukaMejl=""//vec postoji korisnik sa ovim mejlom
porukaKorisnickoIme=""//vec postoji korisnik sa ovim korisnickim imenom
porukaLozinka=""//lozinka mora imati najmanje 8 a najvise 12 karaktera, prvi karakter mora biti slovo i mora sadrzati bar 1 broj, bar 1 specijalni karakter i bar 1 veliko slovo
porukaPib0="" //pib ne sme pocinjati cifrom 0
porukaPib=""//pib koji ste uneli pripada vec registrovanom klijentu, molimo vas unesite tacan pib!
porukaMB=""//maticni broj koji ste uneli pripada vec registrovanom klijentu, molimo vas unesite tacan maticni broj!


registracija(){
  if(this.popunjenaPolja()==false)return
  if(this.jedinstveno()==false)return

  let regexLozinka =  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z].{7,11}$/
if (!regexLozinka.test(this.lozinka)) {
    this.porukaLozinka = "lozinka mora imati najmanje 8 a najvise 12 karaktera, prvi karakter mora biti slovo i mora sadrzati bar 1 broj, bar 1 specijalni karakter i bar 1 veliko slovo";
    return
  }

  let novi= new Korisnik();
 novi.korisnicko_ime = this.korisnicko_ime;
novi.lozinka = this.lozinka;
novi.ime = this.ime;
novi.prezime = this.prezime;
novi.telefon = this.telefon;
novi.mejl = this.mejl;

novi.profilna = "pics/default_profile_image.jpg";
novi.odobren = false;

if (this.tipRegistracije == "fizicko_lice") {
  novi.tip = "klijent";
  novi.podtip = "fizicko_lice";
}
else {
  novi.naziv_institucije = this.naziv_institucije;
  novi.adresa_sedista = this.adresa_sedista;
  novi.grad = this.grad;
  novi.maticni_broj = this.maticni_broj;
  novi.pib = this.pib;

  let regexMB=/^\d{8}$/
  if(!regexMB.test(this.maticni_broj)){
    this.porukaMB="maticni broj mora imati tacno 8 cifara"
    return
  }

  let regexPib=/^[1-9]\d{8}$/
  if(!regexPib.test(this.pib)){
    this.porukaPib="PIB mora imati tacno 9 cifara, a prva cifra ne sme biti 0"
    return
  }


  if (this.tipRegistracije == "pravno_lice") {
    novi.tip = "klijent";
    novi.podtip = "pravno_lice";
  }
  else {
    novi.tip = "stampar";
    novi.podtip = null;
  }
}

const formData = new FormData();
formData.append("korisnicko_ime", novi.korisnicko_ime);
formData.append("ime", novi.ime);
formData.append("prezime", novi.prezime);
formData.append("lozinka", novi.lozinka);
formData.append("telefon", novi.telefon);
formData.append("mejl", novi.mejl);
formData.append("tip", novi.tip);
formData.append("podtip", novi.podtip ?? "");
formData.append("naziv_institucije", novi.naziv_institucije ?? "");
formData.append("adresa_sedista", novi.adresa_sedista ?? "");
formData.append("grad", novi.grad ?? "");
formData.append("pib", novi.pib ?? "");
formData.append("maticni_broj", novi.maticni_broj ?? "");

if (this.izabranaProfilna) {
  formData.append("profilna", this.izabranaProfilna);
}

 this.userServis.registracija(formData).subscribe(data=>{
  if(!data){ this.glavnaPoruka="Doslo je do greske prilikom registracije, molimo pokusajte ponovo"}
  else{
   this.glavnaPoruka="Cestitamo! Vas zahtev za registraciju je primljen i ceka na odobrenje admina! U medjuvremenu nastavite rad sa stranicom kao gost"
  this.korisnickaImena.push(novi.korisnicko_ime)
  this.mejlovi.push(novi.mejl)
  if(novi.pib)this.pibovi.push(novi.pib)
  if(novi.maticni_broj)this.maticniBrojevi.push(novi.maticni_broj)
  }
 })

}


porukaProfilna=""
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files||input.files.length==0) {
    return
  }
  const file = input.files[0]
  const dozvoljeniTipovi = ["image/jpeg","image/png","image/gif" ]

  if (!dozvoljeniTipovi.includes(file.type)) {
    this.porukaProfilna="Dozvoljeni formati su JPG, PNG i GIF."
    this.izabranaProfilna=null
    return
  }
  const img = new Image()
  const objectUrl = URL.createObjectURL(file)
  img.onload = () => {
    if (img.width<100||img.height<100||img.width>250||img.height>250){
      this.porukaProfilna="Slika mora biti između 100x100 i 250x250 piksela."
      this.izabranaProfilna = null
    }
    else {
      this.porukaProfilna=""
      this.izabranaProfilna=file
    }
    URL.revokeObjectURL(objectUrl)
  };
  img.src = objectUrl;
}

glavnaPoruka=""

popunjenaPolja(){
  this.glavnaPoruka=""
if(this.korisnicko_ime=="" || this.ime=="" || this.prezime=="" || this.lozinka=="" ||
  this.telefon=="" || this.mejl=="") this.glavnaPoruka="Obavezno je popuniti sva polja!"
if(this.tipRegistracije!="fizicko_lice"){
if(this.naziv_institucije=="" || this.adresa_sedista=="" || this.grad=="" ||this.pib==""
  || this.maticni_broj=="")this.glavnaPoruka="Obavezno je popuniti sva polja!"
}
if(this.glavnaPoruka!="") return false
return true
}

jedinstveno(){
  let korImeJedinstveno=true
  let pibJedinstven=true
  let mbJedinstven=true
  let mejlJedinstven=true
  this.korisnickaImena.forEach(ime=>{
    if(ime==this.korisnicko_ime){
      korImeJedinstveno=false
    }
  })
    this.mejlovi.forEach(mejl=>{
    if(mejl==this.mejl){
      mejlJedinstven=false
    }
  })
  if(this.tipRegistracije!="fizicko_lice"){
  this.pibovi.forEach(pib=>{
    if(pib==this.pib){
      pibJedinstven=false
    }
  })
  this.maticniBrojevi.forEach(mb=>{
    if(mb==this.maticni_broj){
      mbJedinstven=false
    }
  })
  }
  if(!korImeJedinstveno)this.porukaKorisnickoIme="vec postoji korisnik sa ovim korisnickim imenom"
  if(!mejlJedinstven)this.porukaMejl="vec postoji korisnik sa ovim mejlom"
  if(!pibJedinstven)this.porukaPib="pib koji ste uneli pripada vec registrovanom klijentu, molimo vas unesite tacan pib!"
  if(!mbJedinstven)this.porukaMB="maticni broj koji ste uneli pripada vec registrovanom klijentu, molimo vas unesite tacan maticni broj!"
if(!(mbJedinstven&&mejlJedinstven&&korImeJedinstveno&&pibJedinstven)) return false
return true
}

}

// | Regex         | Meaning                               | Example                                  |
// | ------------- | ------------------------------------- | ---------------------------------------- |
// | `^`           | beginning of string                   | `^A` → starts with A                     |
// | `$`           | end of string                         | `A$` → ends with A                       |
// | `.`           | any character                         | `a.c` → `abc`, `a7c`                     |
// | `[abc]`       | one of these characters               | `a`, `b`, or `c`                         |
// | `[^abc]`      | anything **except** these             | not `a`, `b`, or `c`                     |
// | `[a-z]`       | lowercase letter a–z                  | `g`                                      |
// | `[A-Z]`       | uppercase letter A–Z                  | `G`                                      |
// | `[0-9]`       | digit 0–9                             | `7`                                      |
// | `[A-Za-z]`    | any letter                            | `A`, `g`                                 |
// | `[A-Za-z0-9]` | letter or digit                       | `A`, `g`, `7`                            |
// | `\d`          | digit                                 | same as `[0-9]`                          |
// | `\D`          | anything except a digit               | `A`, `!`                                 |
// | `\w`          | letter, digit or `_`                  | `a`, `7`, `_`                            |
// | `\W`          | anything except `\w`                  | `!`, `@`, space                          |
// | `\s`          | whitespace                            | space, tab, newline                      |
// | `\S`          | anything except whitespace            | `A`, `7`, `!`                            |
// | `*`           | **0 or more**                         | `a*` → `""`, `a`, `aaa`                  |
// | `+`           | **1 or more**                         | `a+` → `a`, `aaa`                        |
// | `?`           | **0 or 1** / optional                 | `a?` → `""` or `a`                       |
// | `{n}`         | exactly `n` times                     | `\d{8}` → exactly 8 digits               |
// | `{n,}`        | at least `n` times                    | `\d{3,}` → 3+ digits                     |
// | `{n,m}`       | between `n` and `m` times             | `.{8,12}`                                |
// | `(abc)`       | group                                 | `(ab)+` → `ab`, `abab`                   |
// | `a\|b`        | OR                                    | `cat\|dog`                               |
// | `(?=...)`     | must contain / positive lookahead     | `(?=.*[A-Z])`                            |
// | `(?!...)`     | must NOT satisfy / negative lookahead | `(?!.*abc)`                              |
// | `\.`          | literal `.`                           | because `.` normally means any character |
// | `\+`          | literal `+`                           | useful in phone numbers                  |
// | `\\`          | literal `\`                           | backslash                                |
// (?=.*X) negde mora biti X
// /^[A-Za-z]+$/ samo slova
// [abc] a ili b ili c
// (abc) abc sekvenca
