import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Proizvod } from '../../modeli/Proizvod';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { Komentar } from '../../modeli/Komentar';

@Component({
  selector: 'app-detalji',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './detalji.html',
  styleUrl: './detalji.css',
})
export class Detalji implements OnInit{
  ngOnInit(): void {

    this.galerija=[]
    let sifra=localStorage.getItem("sifra_proizvoda")
    this.proizvodServis.dohvatiIzabraniProizvod(sifra+"").subscribe(data=>{
      if(data){
        this.proizvod=data
        this.postaviGaleriju()
        this.dohvatiKomentare(sifra+"")
          this.userServis.dohvatiGradStamparije(data.korisnicko_ime_vlasnika).subscribe(data=>{
            if(data){
              this.grad=data+""
            }
          })
      }

    })

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

  nazad(){
    this.ruter.navigate([''])
  }

  prijava(){
    this.ruter.navigate(['login'])
  }

  http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  grad=""
  proizvod=new Proizvod()
 izabranaSlika=""
  galerija:string[]=[]
  komentari:Komentar[]=[]
  korisnicko_ime=localStorage.getItem("korisnicko_ime") || ""
}
