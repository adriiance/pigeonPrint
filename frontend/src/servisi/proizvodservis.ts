import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Kategorija, Proizvod } from '../modeli/Proizvod';
import { Observable } from 'rxjs';
import { Komentar } from '../modeli/Komentar';

@Injectable({
  providedIn: 'root',
})
export class Proizvodservis {
  http=inject(HttpClient)
 url="http://localhost:4000/proizvodi"



  dohvatiProizvode(){
   return this.http.get<Proizvod[]>(`${this.url}/top5`);
   }

    dohvatiDostupneProizvode(){
   return this.http.get<Proizvod[]>(`${this.url}/dostupni`);
   }

   dohvatiIzabraniProizvod(sifra:String){
   return this.http.post<Proizvod>(`${this.url}/izabraniProizvod`, {sifra:sifra});
   }

  stampareviProizvodi(sifra:String){
return this.http.post<Proizvod[]>(`${this.url}/stampareviProizvodi`, {idStampar:sifra});
  }

  promeniStanjeNaLageru(sifra:String, br:Number){
return this.http.post<Proizvod>(`${this.url}/promeniStanjeNaLageru`, {sifra:sifra, kolicina:br });
  }

  kreirajProizvod(proizvod:Proizvod){
return this.http.post<Proizvod>(`${this.url}/kreirajProizvod`, proizvod);
  }

  jedinstvenaSifra(){
return this.http.get<String[]>(`${this.url}/jedinstvenaSifra`);
  }

  sveKategorije(){
return this.http.get<Kategorija[]>(`${this.url}/kategorije`);
  }

  dodajSlikeProizvoda(glavna:File,dodatna1:File|null,dodatna2:File|null,dodatna3:File|null) {
    const formData=new FormData()
    formData.append("glavna",glavna)
    if(dodatna1){formData.append("dodatne",dodatna1)}
    if(dodatna2){formData.append("dodatne",dodatna2)}
    if(dodatna3){formData.append("dodatne",dodatna3)}
     return this.http.post<{glavna_slika: string,dodatne_slike: string[]}>(`${this.url}/dodajSlike`, formData);
}

reaguj(korisnicko_ime:string, idProizvoda:string, reakcija:string){
return this.http.post<Proizvod>(`${this.url}/reaguj`, {korisnicko_ime:korisnicko_ime, idProizvoda:idProizvoda, reakcija:reakcija});
}

komentarisi(korisnicko_ime:string, idProizvoda:string, tekst:string){
  return this.http.post<Komentar>(`${this.url}/dodajKomentar`, {korisnicko_ime:korisnicko_ime, sifra_proizvoda:idProizvoda, tekst:tekst});
}

najnovijiKomentari(idProizvoda:string){
  return this.http.post<Komentar[]>(`${this.url}/dohvatiPoslednjihPetKomentara`, {sifraProizvoda:idProizvoda});
}
}
