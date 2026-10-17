import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JavnaNabavka } from '../modeli/JavnaNabavka';

@Injectable({
  providedIn: 'root',
})
export class Javnanabavkaservis {
   http=inject(HttpClient)
 url="http://localhost:4000/javneNabavke"

  kreirajNabavku(nova:JavnaNabavka){
     return this.http.post<JavnaNabavka>(`${this.url}/kreirajNabavku`,{novaNabavka:nova});
     }
   dajPonudu(idJN:string, korIme:string, iznos:number){
    return this.http.post<JavnaNabavka>(`${this.url}/dajPonudu`,{id:idJN, korIme:korIme, iznos:iznos});
   }
   mojeJavneNabavke(korIme:string){
    return this.http.post<JavnaNabavka[]>(`${this.url}/mojeJavneNabavke`,{korisnickoIme:korIme});
   }
    otvoreneJavneNabavke(){
    return this.http.get<JavnaNabavka[]>(`${this.url}/otvoreneJavneNabavke`);
   }

   //mojeJavneNabavke
}
