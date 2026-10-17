import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { HttpClient } from '@angular/common/http';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { Proizvod } from '../../modeli/Proizvod';
import { Komentar } from '../../modeli/Komentar';
import * as L from 'leaflet';

@Component({
  selector: 'app-detaljiprosireno',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './detaljiprosireno.html',
  styleUrl: './detaljiprosireno.css',
})
export class Detaljiprosireno implements OnInit{
  ngOnInit(): void {

    this.galerija=[]
    let sifra=localStorage.getItem("sifra_proizvoda")
    this.proizvodServis.dohvatiIzabraniProizvod(sifra+"").subscribe(data=>{
      if(data){
        this.proizvod=data
        this.izabranaUsluga=this.proizvod.usluge_stampe[0].naziv+""
        this.postaviGaleriju()
        this.dohvatiKomentare(sifra+"")
          this.userServis.dohvatiLokacijuStamparije(data.korisnicko_ime_vlasnika).subscribe(lokacija=>{
        if(lokacija){
          this.grad = lokacija.grad
            this.adresa = lokacija.adresa_sedista
           this.prikaziMapu()
  }
})
      }

    })

  }
  http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  grad=""
  adresa=""
  proizvod=new Proizvod()
izabranaSlika=""
  galerija:string[]=[]
  izabranaBoja:string="bela"
  izabranaUsluga:string=""
    komentari:Komentar[]=[]
  korisnicko_ime=localStorage.getItem("korisnicko_ime") || ""


  prikaziMapu(){
  let punaAdresa=`${this.adresa}, ${this.grad}, Serbia`
  let url=`https://nominatim.openstreetmap.org/search?`+`format=json&q=${encodeURIComponent(punaAdresa)}&countrycodes=rs&limit=1`
  this.http.get<any[]>(url).subscribe(data=>{
    if(data.length > 0){
      let sirina=Number(data[0].lat)
      let duzina=Number(data[0].lon)
let mapa = L.map('mapa').setView([sirina, duzina], 16)

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors'
  }
).addTo(mapa)

let ikonica = L.divIcon({
  className: 'pigeon-map-marker',
  html: '<span>&#128204;</span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
})

L.marker([sirina, duzina], {icon: ikonica})
  .addTo(mapa)
  .bindPopup(`${this.proizvod.naziv_stamparije}<br>${this.adresa}, ${this.grad}`)

setTimeout(() => {
  mapa.invalidateSize()
}, 100)
    }
  })
}

  dohvatiKomentare(sifraProizvoda:string){
    this.proizvodServis.najnovijiKomentari(sifraProizvoda).subscribe(data=>{
      if(data){
        this.komentari=data
      }
    })
  }

  mojKomentar(komentar:Komentar){
    return this.korisnicko_ime != "" && komentar.korisnicko_ime == this.korisnicko_ime
  }

  formatirajDatum(datum:Date){
    return new Date(datum).toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }


  kupovina(){
    localStorage.setItem("izabranaBoja", this.izabranaBoja)
    localStorage.setItem("izabranaUsluga", this.izabranaUsluga)
    this.ruter.navigate(['kupovina'])
  }

postaviGaleriju(){
    this.galerija=[this.proizvod.glavna_slika, ...(this.proizvod.dodatne_slike||[])].filter(slika=>!!slika).map(slika=>this.putanjaSlike(slika))
    let sacuvana=this.procitajCookie(`pigeonPrintSlika_${this.proizvod.sifra}`)
    this.izabranaSlika = sacuvana && this.galerija.includes(sacuvana)?sacuvana:(this.galerija[0]||"")
  }

  promeniSliku(slika:string){
    this.izabranaSlika=slika
    document.cookie=`pigeonPrintSlika_${this.proizvod.sifra}=${encodeURIComponent(slika)}; path=/; max-age=2592000`
  }
putanjaSlike(slika:string){
  if(!slika) return ""

  if(slika.startsWith("products/")){
    return "/" + slika
  }

  return "http://localhost:4000/pics/" + slika
}

  procitajCookie(naziv: string){
    let deo =document.cookie.split("; ").find(cookie=>cookie.startsWith(naziv+"="))
    return deo?decodeURIComponent(deo.split("=").slice(1).join("=")):""
  }

  nazad(){
    this.ruter.navigate(['/'])
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

}

