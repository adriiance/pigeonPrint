import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { Fakturaservis } from '../../servisi/fakturaservis';
import { Javnanabavkaservis } from '../../servisi/javnanabavkaservis';
import { Kategorija, Proizvod, UslugaStampe } from '../../modeli/Proizvod';

@Component({
  selector: 'app-noviproizvod',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './noviproizvod.html',
  styleUrl: './noviproizvod.css',
})
export class Noviproizvod implements OnInit{
  ngOnInit(): void {
    this.stampar_korisnickoIme=localStorage.getItem("korisnicko_ime")|| ""
  this.stampar_naziv=localStorage.getItem("stampar")|| ""
  this.usluge_stampe=[]
  this.boje=[]
  this.kategorije=[]
  this.proizvodServis.sveKategorije().subscribe(data=>{
    if(data){
      this.kategorije=data
    }
  })
  this.proizvodServis.jedinstvenaSifra().subscribe(data=>{
    if(data){
      this.sifre=data
    }
  })
  }
http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  fakturaServis=inject(Fakturaservis)
  javnaNabavkaServis=inject(Javnanabavkaservis)

 proizvod:Proizvod=new Proizvod()

sifra=""
naziv=""
stampar_korisnickoIme=""
stampar_naziv=""
opis=""
kategorija=""
potkategorija=""
jedinicna_cena=0
kolicina=0
boje:string[]=[]
glavnaSlika:File|null=null
dodatnaSlika1:File|null=null
dodatnaSlika2:File|null=null
dodatnaSlika3:File|null=null
usluge_stampe:UslugaStampe[]=[]
kategorije:Kategorija[]=[]
sifre:String[]=[]

jedinstvenaSifra(){
  let rezultat=true
  this.sifre.forEach(sifra=>{
    if(sifra==this.sifra) rezultat=false
  })
  return rezultat
}

  nazivUSlugeStampe = ""
    dodatna_cena_po_komadu = 0
    max_sirina_mm = 0
    max_visina_mm = 0

dodajUsluguStampanja(){
let novaUsluga=new UslugaStampe()
novaUsluga.naziv=this.nazivUSlugeStampe
novaUsluga.dodatna_cena_po_komadu=this.dodatna_cena_po_komadu
novaUsluga.max_sirina_mm=this.max_sirina_mm
novaUsluga.max_visina_mm=this.max_visina_mm
if(this.nazivUSlugeStampe==""){
  this.poruka="Niste naveli naziv usluge štampe"
  return
}
this.usluge_stampe.push(novaUsluga)
this.nazivUSlugeStampe = ""
this.dodatna_cena_po_komadu = 0
this.max_sirina_mm = 0
this.max_visina_mm = 0
}

nazad(){
  this.poruka=""
      this.usluge_stampe=[]
  this.boje=[]
  this.ruter.navigate(['stampar'])
}

  bojaCSS(boja:string){
    let boje:{[key: string]:string}={
      "bela": "#f8f6ef",
      "krem": "#eadfc7",
      "siva": "#9ca3a6",
      "plava": "#607f9b",
      "crna": "#202421",
      "crvena": "#ab2a2a",
      "zuta": "#d8b85d",
      "žuta": "#d8b85d",
      "zelena": "#456b52",
      "roze": "#c9949d",
      "pink": "#c9949d"
        }
    return boje[boja.toLowerCase()]||"#c5cbd0"
  }

  ponistiUnos(){
 this.sifra=""
 this.naziv=""
 this.opis=""
 this.kategorija=""
 this.potkategorija=""
 this.jedinicna_cena=0
 this.kolicina=0
 this.boje=[]
 this.glavnaSlika=null
 this.dodatnaSlika1=null
 this.dodatnaSlika2=null
 this.dodatnaSlika3=null
 this.usluge_stampe=[]
 this.nazivUSlugeStampe = ""
 this.dodatna_cena_po_komadu = 0
 this.max_sirina_mm = 0
 this.max_visina_mm = 0
 this.poruka=""
  }

  izabranaGlavnaSlika(event: Event){
  const input=event.target as HTMLInputElement;
  if (input.files&&input.files.length>0) {
    this.glavnaSlika=input.files[0];
  }
}

izabranaDodatnaSlika1(event:Event){
  const input = event.target as HTMLInputElement;
  if (input.files&&input.files.length>0){
    this.dodatnaSlika1 = input.files[0];
  }
}


izabranaDodatnaSlika2(event:Event){
  const input = event.target as HTMLInputElement;
  if (input.files&&input.files.length>0){
    this.dodatnaSlika2 = input.files[0];
  }
}

izabranaDodatnaSlika3(event:Event){
  const input = event.target as HTMLInputElement;
  if (input.files&&input.files.length>0){
    this.dodatnaSlika3 = input.files[0];
  }
}


  odustaniOdProizvoda(){
  this.poruka=""
  this.usluge_stampe=[]
  this.boje=[]
  this.ruter.navigate(['stampar'])
  }

dostupneBoje = [
  "Bela",
  "Krem",
  "Siva",
  "Plava",
  "Crna",
  "Crvena",
  "Žuta",
  "Zelena",
  "Roze"
]

izabranaBoja = ""

dodajBoju(){
  if (this.izabranaBoja!= "" && !this.boje.includes(this.izabranaBoja)) {
    this.boje.push(this.izabranaBoja)
  }
  this.izabranaBoja = ""
}

ukloniBoju(boja: string) {
  this.boje = this.boje.filter(b => b != boja)
}

  poruka=""

  kreirajProizvod(){
    if(this.sifra=="" || this.naziv==""  || this.stampar_korisnickoIme=="" || this.stampar_naziv=="" ||
this.opis=="" || this.kategorija=="" || this.potkategorija=="" || this.glavnaSlika==null ||
 this.usluge_stampe.length==0){
this.poruka="Obavezno je popuniti SVA polja pre kreiranja novog proizvoda"
return
 }
 if(this.jedinstvenaSifra()==false){
  this.poruka="Već postoji proizvod sa šifrom koju ste uneli"
return
 }
  this.poruka=""
 this.proizvod.sifra=this.sifra
 this.proizvod.naziv=this.naziv
 this.proizvod.korisnicko_ime_vlasnika=this.stampar_korisnickoIme
 this.proizvod.naziv_stamparije=this.stampar_naziv
 this.proizvod.opis=this.opis
 this.proizvod.kategorija=this.kategorija
 this.proizvod.potkategorija=this.potkategorija
 this.proizvod.jedinicna_cena=this.jedinicna_cena
 this.proizvod.kolicina_na_lageru=this.kolicina
 this.proizvod.boje=this.boje
this.proizvodServis.dodajSlikeProizvoda(this.glavnaSlika,this.dodatnaSlika1,this.dodatnaSlika2,this.dodatnaSlika3).subscribe(slike=>{
this.proizvod.glavna_slika = slike.glavna_slika
this.proizvod.dodatne_slike = slike.dodatne_slike
 this.proizvod.usluge_stampe=this.usluge_stampe
this.proizvodServis.kreirajProizvod(this.proizvod).subscribe(data=>{
  if(data){
    this.ponistiUnos()
    this.poruka="Kreirali ste novi proizvod! Vratite se na svoju početnu stranicu ili kreirajte još proizvoda"
  }
  else{
    this.poruka="Došlo je do greške prilikom kreiranja proizvoda. Pokušajte ponovo!"
  }
})
})
  }
}

