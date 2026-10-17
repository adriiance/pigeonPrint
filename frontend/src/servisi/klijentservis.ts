import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Korisnik } from '../modeli/Korisnik';

@Injectable({
  providedIn: 'root',
})
export class Klijentservis {
http=inject(HttpClient)
 url="http://localhost:4000/korisnici"

  login(korisnickoime:string, loz:string){
  return this.http.post<Korisnik>(`${this.url}/login`, {korisnicko_ime:korisnickoime, lozinka:loz});
  }

  registracija(formData: FormData){
    return this.http.post<Korisnik>(`${this.url}/registracija`, formData);
  }

  korisnickaImena(){
    return this.http.get<String[]>(`${this.url}/korisnickaImena`);
  }

  mejlovi(){
    return this.http.get<String[]>(`${this.url}/mejlovi`);
  }

  pibovi(){
    return this.http.get<String[]>(`${this.url}/pibovi`);
  }

  maticniBrojevi(){
    return this.http.get<String[]>(`${this.url}/maticniBrojevi`);
  }

  logout(){
  localStorage.removeItem("tip")
  localStorage.removeItem("podtip")
  localStorage.removeItem("ulogovaniKorisnik")
  localStorage.removeItem("korisnicko_ime")
  }

  dohvatiStamparije(){
    return this.http.get<Korisnik[]>(`${this.url}/stamparije`);
  }

  dohvatiLokacijuStamparije(korImeStamparije:String){
  return this.http.post<{grad:string,adresa_sedista:string}>(`${this.url}/lokacija`, {korisnicko_ime: korImeStamparije});
}

     dohvatiGradStamparije(korImeStamparije:String){
return this.http.post<String>(`${this.url}/grad`, {korisnicko_ime:korImeStamparije});
   }

   ulogovaniKorisnik(korisnickoIme:string){
     return this.http.post<Korisnik>(`${this.url}/ulogovaniKorisnik`, {korIme:korisnickoIme});
   }

   postojeciMaticni(korisnickoIme:string, maticniBroj:string){
     return this.http.post<Korisnik>(`${this.url}/postojeciMaticni`, {korisnicko_ime:korisnickoIme, maticni_broj:maticniBroj});
   }

   postojeciPib(korisnickoIme:string, pib:string){
     return this.http.post<Korisnik>(`${this.url}/postojeciPib`, {korisnicko_ime:korisnickoIme, pib:pib});
   }

   azurirajKorisnika(k:Korisnik, profilna:File|null){
    const formData=new FormData()
    formData.append("korisnicko_ime", k.korisnicko_ime)
    formData.append("ime", k.ime)
    formData.append("prezime", k.prezime)
    formData.append("telefon", k.telefon)
    formData.append("mejl", k.mejl)
    formData.append("maticni_broj", k.maticni_broj||"")
    formData.append("pib", k.pib||"")
    formData.append("grad", k.grad||"")
    formData.append("adresa_sedista", k.adresa_sedista||"")

    if(profilna){
      formData.append("profilna", profilna)
    }
    return this.http.post<Korisnik>(`${this.url}/azurirajKorisnika`, formData);
  }

   odbijKorisnika(korisnickoIme:string){
     return this.http.post<Korisnik>(`${this.url}/odbijKorisnika`, {korisnicko_ime:korisnickoIme});
   }

   prihvatiKorisnika(korisnickoIme:string){
     return this.http.post<Korisnik>(`${this.url}/prihvatiKorisnika`, {korisnicko_ime:korisnickoIme});
   }

   obrisiKorisnika(korisnickoIme:string){
     return this.http.post<Korisnik>(`${this.url}/obrisiKorisnika`, {korisnicko_ime:korisnickoIme});
   }

   adminUklanjaSliku(korisnickoIme:string){
    return this.http.post<Korisnik>(`${this.url}/adminSklanjaProfilnu`, {korisnicko_ime:korisnickoIme});
   }

adminAzuriraKorisnika(korisnickoIme:string, k:Korisnik ){
     return this.http.post<Korisnik>(`${this.url}/adminAzuriraKorisnika`,  {
      korisnicko_ime: korisnickoIme,
      ime: k.ime,
      prezime: k.prezime,
      telefon: k.telefon,
      mejl: k.mejl,
      maticni_broj: k.maticni_broj || "",
      pib: k.pib || "",
      grad: k.grad || "",
      adresa_sedista: k.adresa_sedista || ""
    });
   }

odobreniKorisnici(){
    return this.http.get<Korisnik[]>(`${this.url}/odobreniKorisnici`);
}

neodobreniKorisnici(){
    return this.http.get<Korisnik[]>(`${this.url}/neodobreniKorisnici`);

}
}
