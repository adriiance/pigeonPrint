import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { HttpClient } from '@angular/common/http';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { Proizvod } from '../../modeli/Proizvod';
import { StavkaKorpe } from '../../modeli/StavkaKorpe';

@Component({
  selector: 'app-kupovina',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './kupovina.html',
  styleUrl: './kupovina.css',
})
export class Kupovina implements OnInit{
  ngOnInit(): void {
  this.uspesnoDodato=false
  this.poruka=""
    this.izabranaBoja=localStorage.getItem("izabranaBoja")+""
    this.izabranaUsluga=localStorage.getItem("izabranaUsluga")+""

      let sifra=localStorage.getItem("sifra_proizvoda")
    this.proizvodServis.dohvatiIzabraniProizvod(sifra+"").subscribe(data=>{
      if(data){
        this.proizvod=data
      }

    })
  }

 http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  proizvod=new Proizvod()
  izabranaBoja="bela"
  izabranaUsluga=""
  kolicina=1

  ukupnaCena(){
     let dodatnaCenaStampe=0
    this.proizvod.usluge_stampe.forEach(usluga=>{
      if(usluga.naziv==this.izabranaUsluga)dodatnaCenaStampe=usluga.dodatna_cena_po_komadu
    })
    let ukupnaCena=(dodatnaCenaStampe+this.proizvod.jedinicna_cena)*this.kolicina
    return ukupnaCena
  }

  korpa(){
     this.porukaKolicina=""
    this.poruka=""
    this.uspesnoDodato=false

    if(!Number.isInteger(Number(this.kolicina)) || Number(this.kolicina)<1){
      this.porukaKolicina="Morate poručiti bar 1 proizvod."
      return
    }

    if(Number(this.kolicina)>this.proizvod.kolicina_na_lageru){
      this.porukaKolicina="Trenutno nema dovoljno proizvoda na stanju."
      return
    }
    let novaStavka=new StavkaKorpe()
    novaStavka.boja=this.izabranaBoja
    novaStavka.tipStampe=this.izabranaUsluga
    let dodatnaCenaStampe=0
    this.proizvod.usluge_stampe.forEach(usluga=>{
      if(usluga.naziv==this.izabranaUsluga)dodatnaCenaStampe=usluga.dodatna_cena_po_komadu
    })
    let ukupnaCena=(dodatnaCenaStampe+this.proizvod.jedinicna_cena)*this.kolicina
    novaStavka.dodatnaCenaStampe=dodatnaCenaStampe
    novaStavka.jedinicnaCena=this.proizvod.jedinicna_cena
    novaStavka.kolicina=this.kolicina
    novaStavka.korisnickoImeStampara=this.proizvod.korisnicko_ime_vlasnika
    novaStavka.nazivProizvoda=this.proizvod.naziv
    novaStavka.sifraProizvoda=this.proizvod.sifra
    novaStavka.ukupnaCena=ukupnaCena
    novaStavka.glavnaSlika=this.proizvod.glavna_slika

    let stavke:StavkaKorpe[]=[]
    if(localStorage.getItem("stavke")){
      stavke= JSON.parse(localStorage.getItem("stavke")+"")
    }
    stavke.push(novaStavka)
    localStorage.setItem("stavke", JSON.stringify(stavke))
   this.uspesnoDodato=true
    this.poruka="Proizvod je dodat u korpu. Golub ga čuva za tebe!"
  }

  uspesnoDodato=false
  poruka=""
  porukaKolicina=""

  ponisti(){
    this.kolicina=1
    this.poruka=""
    this.porukaKolicina=""
    this.uspesnoDodato=false
  }


    nazad(){
    this.ruter.navigate(['/detaljiProsireno'])
  }

  otvoriKorpu(){
    this.ruter.navigate(['/korpa'])
  }

  nastaviKupovinu(){
    this.ruter.navigate(['/pocetna'])
  }
putanjaSlike(slika:string){
  if(!slika) return ""

  if(slika.startsWith("products/")){
    return "/" + slika
  }

  return "http://localhost:4000/pics/" + slika
}
  dodatnaCena(){
    let cena=0
    this.proizvod.usluge_stampe.forEach(usluga=>{
      if(usluga.naziv==this.izabranaUsluga)cena=usluga.dodatna_cena_po_komadu
    })
    return cena
  }
}
