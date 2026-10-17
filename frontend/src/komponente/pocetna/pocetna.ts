import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Korisnik } from '../../modeli/Korisnik';
import { Proizvod } from '../../modeli/Proizvod';
import { HttpClient } from '@angular/common/http';
import { Klijentservis } from '../../servisi/klijentservis';
import { Proizvodservis } from '../../servisi/proizvodservis';

@Component({
  selector: 'app-pocetna',
  imports: [FormsModule,RouterModule],
  templateUrl: './pocetna.html',
  styleUrl: './pocetna.css',
})
export class Pocetna implements OnInit{

  ulogovaniKorisnik:Korisnik=new Korisnik()
  mojProfil(){
    if(this.ulogovaniKorisnik){
      if(this.ulogovaniKorisnik.tip=="stampar") this.ruter.navigate(['stampar'])
        if(this.ulogovaniKorisnik.podtip=="fizicko_lice"){this.ruter.navigate(['fizickolice'])}
        else {this.ruter.navigate(['pravnolice'])}
    }
  }

  ngOnInit(): void {
    this.top5proizvodi=[]
    this.stamparije=[]
    this.dostupniProizvodi=[]
    this.kategorije=[]
    let korIme=localStorage.getItem("korisnicko_ime")+""
    this.userServis.ulogovaniKorisnik(korIme).subscribe(data=>{
      this.ulogovaniKorisnik=data
    })

    this.userServis.dohvatiStamparije().subscribe(data=>{
      if(data){
        data.forEach(stampar=>{
          this.stamparije.push(stampar)
        })
      }
    })

    this.proizvodServis.dohvatiProizvode().subscribe(data=>{
      if(data){
        data.forEach(proizvod=>{
          this.top5proizvodi.push(proizvod)
        })
      }
    })

    this.proizvodServis.dohvatiDostupneProizvode().subscribe(data=>{
      if(data){
        this.prikazProizvodi=[]
        data.forEach(proizvod=>{
          this.dostupniProizvodi.push(proizvod)
           this.prikazProizvodi.push(proizvod)
          let kategorija=proizvod.kategorija
          if(this.kategorije.includes(kategorija)==false){this.kategorije.push(kategorija)}
        })

      }
    })

  }
 http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
proizvodServis=inject(Proizvodservis)

proizvodPretraga=""

kategorije:String[]=[]
stamparije:Korisnik[]=[]
top5proizvodi:Proizvod[]=[]
dostupniProizvodi:Proizvod[]=[]
prikazProizvodi:Proizvod[]=[]

detalji(sifra:String){
  localStorage.setItem("sifra_proizvoda",sifra+"")
let ulogovan=localStorage.getItem("korisnicko_ime")
if(ulogovan){
this.ruter.navigate(['detaljiProsireno'])
}
else{
  this.ruter.navigate(['detalji'])
}
}

putanjaSlike(slika:string){
if(!slika) return ""
if(slika.startsWith("products/")){return "/" + slika}
return "http://localhost:4000/pics/" + slika
}

tipSortiranja=""
izabranaKategorija=""
 pretraga() {this.primeniPrikaz()}

  filterKategorije() {this.primeniPrikaz()}

  sortiraj() {this.primeniPrikaz() }

  resetujPretragu(){
    this.proizvodPretraga=""
    this.izabranaKategorija=""
    this.tipSortiranja="podrazumevano"
    this.primeniPrikaz()
  }

  private primeniPrikaz(){
    let moguciProizvodi=this.dostupniProizvodi.filter(proizvod =>{
      let odgovaraNaziv=proizvod.naziv.toLocaleLowerCase().includes(this.proizvodPretraga.toLocaleLowerCase())
      let odgovaraKategorija=this.izabranaKategorija=="" || proizvod.kategorija==this.izabranaKategorija
      return (odgovaraNaziv&&odgovaraKategorija)
    })

    if (this.tipSortiranja=="A-z") {
      moguciProizvodi.sort((a, b)=>a.naziv.localeCompare(b.naziv))
    }
    else if (this.tipSortiranja=="Z-a") {
      moguciProizvodi.sort((a, b)=>b.naziv.localeCompare(a.naziv))
    }

    this.prikazProizvodi = moguciProizvodi
  }


}
