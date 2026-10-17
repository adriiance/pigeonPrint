import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Faktura } from '../modeli/Faktura';

@Injectable({
  providedIn: 'root',
})
export class Fakturaservis {
   http=inject(HttpClient)
 url="http://localhost:4000/fakture"

dodajFakturu(novaFaktura:Faktura){
   return this.http.post<Faktura>(`${this.url}/novaFaktura`, {novaFaktura:novaFaktura});
   }
mojeFakture(korisnickoIme:string){
  return this.http.post<Faktura[]>(`${this.url}/mojeFakture`, {korIme:korisnickoIme});
}
mojeFaktureStampar(korisnickoIme:string){
  return this.http.post<Faktura[]>(`${this.url}/mojeFaktureStampar`, {korIme:korisnickoIme});
}
otkaziFakuturu(id:string){
return this.http.post<Faktura[]>(`${this.url}/otkaziFakturu`, {id:id});
}
promeniStatusFakture(id:string, noviStatus:string){
return this.http.post<Faktura>(`${this.url}/promeniStatusFakture`, {id:id, noviStatus:noviStatus});
}
promeniStatusProizvoda(id:string, idProizvoda:string){
  return this.http.post<Faktura>(`${this.url}/promeniStatusProizvoda`, {id:id, idProizvoda:idProizvoda});
}

ostaviReakciju(id:string, idProizvoda:string){
  return this.http.post<Faktura>(`${this.url}/promeniStatusProizvoda`, {id:id, idProizvoda:idProizvoda});
}
}
