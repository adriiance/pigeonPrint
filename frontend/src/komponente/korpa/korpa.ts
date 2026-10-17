import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { GrupaKorpe, StavkaKorpe } from '../../modeli/StavkaKorpe';
import { Faktura } from '../../modeli/Faktura';
import { Fakturaservis } from '../../servisi/fakturaservis';
import { Korisnik } from '../../modeli/Korisnik';
import { JavnaNabavka } from '../../modeli/JavnaNabavka';
import { Javnanabavkaservis } from '../../servisi/javnanabavkaservis';

interface Stampari{
  korisnicko_ime:String
  naziv:String
}

@Component({
  selector: 'app-korpa',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './korpa.html',
  styleUrl: './korpa.css',
})

export class Korpa implements OnInit{
  ngOnInit(): void {

    this.stavke=[]
    this.poruka=""
    this.grupe=[]
    //localStorage.removeItem("stavke")
    if(localStorage.getItem("stavke")){
      this.stavke=JSON.parse(localStorage.getItem("stavke")+"")
    }
    if(this.stavke.length==0){this.poruka="Vasa korpa je trenutno prazna"}
    else{
      this.popuniStampare()

    }
  }
putanjaSlike(slika:string){
  if(!slika) return ""

  if(slika.startsWith("products/")){
    return "/" + slika
  }

  return "http://localhost:4000/pics/" + slika
}
  postojiStampar(korIme:string){
    let postoji=false
    this.stampari.forEach(data=>{
      if(data.korisnicko_ime==korIme) postoji=true
    })
    return postoji
  }

  popuniStampare(){
    this.userServis.dohvatiStamparije().subscribe(data=>{
      if(data){
        data.forEach(stampar=>{
           this.stavke.forEach(stavka=>{
        if(stavka.korisnickoImeStampara==stampar.korisnicko_ime && !this.postojiStampar(stampar.korisnicko_ime)){
          this.stampari.push({korisnicko_ime:stavka.korisnickoImeStampara, naziv:stampar.naziv_institucije+""})
        }
      })
        })

         this.napraviGrupe()
      }
      })

  }

  grupe:GrupaKorpe[]=[]
  stampari:Stampari[]=[]

  napraviGrupe(){
    this.stampari.forEach(stampar=>{
      let novaGrupa= new GrupaKorpe()
      novaGrupa.korisnicko_ime_stampara=stampar.korisnicko_ime+""
      novaGrupa.nazivStamparije=stampar.naziv+""
      this.grupe.push(novaGrupa)
      })
   this.stavke.forEach(stavka=>{
    this.grupe.forEach(grupa=>{
      if(grupa.korisnicko_ime_stampara==stavka.korisnickoImeStampara){
        grupa.stavke.push(stavka)
        grupa.ukupno+=stavka.ukupnaCena
      }
    })
   })
  }

ukupnoKomada(){
  let ukupno=0
  this.stavke.forEach(stavka=>{
    ukupno+=stavka.kolicina
  })
  return ukupno
  }

nazadNaProizvode(){
    this.ruter.navigate(['/'])
  }

   ukupanIznos(){
    let zbir=0
     this.stavke.forEach(stavka=>{
    zbir+=stavka.ukupnaCena
  })
    return zbir
  }


  poruci(){
    let korisnik:Korisnik=new Korisnik()
    let korIme=localStorage.getItem("korisnicko_ime")+""
    this.userServis.ulogovaniKorisnik(korIme).subscribe(data=>{
      if(data){
        korisnik=data
        if(korisnik.tip=="klijent"){
           if(korisnik.podtip=="fizicko_lice"){
            this.novaPorudzbina()
        }
        else{
          this.kreirajNabavku(korisnik)
        }
        }

      }
    })
  }


  kreirajNabavku(k:Korisnik) {

  let nova=new JavnaNabavka()
  nova.id_nabavke=Date.now()+k.korisnicko_ime
  nova.korisnicko_ime_klijenta=k.korisnicko_ime
  nova.stavke = this.stavke
  nova.naziv_institucije=k.naziv_institucije+""

  this.javnaNabavkaServis.kreirajNabavku(nova).subscribe(data => {
    if (data) {
      this.stavke = []
      this.grupe = []
      localStorage.removeItem("stavke")
      this.poruka = "Kreirana je nova javna nabavka!!"
    }
    else {
      this.poruka ="Došlo je do greške prilikom kreiranja javne nabavke, probajte ponovo"
    }
  })
}

 novaPorudzbina(){
  let brojSacuvanihFaktura=0
  this.grupe.forEach(stampar=>{
    let novaFaktura=new Faktura()
    novaFaktura.korisnicko_ime_klijenta=localStorage.getItem("korisnicko_ime")+""
    novaFaktura.korisnicko_ime_stampara=stampar.korisnicko_ime_stampara
    novaFaktura.naziv_stamparije=stampar.nazivStamparije
    novaFaktura.stavke=stampar.stavke
    novaFaktura.ukupni_iznos=stampar.ukupno
    novaFaktura.id_fakture=Date.now()+stampar.korisnicko_ime_stampara
    this.userServis.dohvatiGradStamparije(stampar.korisnicko_ime_stampara).subscribe(
      data=>{
        if(data){
        novaFaktura.grad_stamparije=data+""
        this.fakturaServis.dodajFakturu(novaFaktura).subscribe(data=>{
         if(data){
        brojSacuvanihFaktura++
        if(brojSacuvanihFaktura==this.grupe.length){
          this.stavke=[]
          this.grupe=[]
          localStorage.removeItem("stavke")
          this.poruka="Porudžbina je uspešno potvrđena!"
        }
      }
      else{
        this.poruka="Došlo je do greške prilikom kreiranja porudžbine :("
      }
        })
      }
      else{
         this.poruka="Došlo je do greške prilikom čuvanja fakture :("
      }

      }
    )
  })
 }

 http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  fakturaServis=inject(Fakturaservis)
  javnaNabavkaServis=inject(Javnanabavkaservis)
  stavke:StavkaKorpe[]=[]
  poruka=""
}
