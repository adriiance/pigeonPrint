import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Korisnik } from '../../modeli/Korisnik';
import { Klijentservis } from '../../servisi/klijentservis';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterOutlet, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{
  ngOnInit(): void {
     this.korisnicko_ime=localStorage.getItem("korisnicko_ime")+""
    if(localStorage.getItem("korisnicko_ime")){
      this.neodobreniKorisnici=[]
      this.odobreniKorisnici=[]
      this.userServis.ulogovaniKorisnik(this.korisnicko_ime).subscribe(data=>{
        if(data){
          this.korisnik=data
          this.ime=data.ime
          this.prezime=data.prezime
          this.mejl=data.mejl

          this.profilna=data.profilna
          this.dohvatiKorisnike()

  }})
}
  }

ukloniSlikuKorisniku(korIme:string){
  this.userServis.adminUklanjaSliku(korIme).subscribe(data=>{
    if(data){
      this.dohvatiKorisnike()
    }
  })
}

  dohvatiKorisnike(){
  this.userServis.odobreniKorisnici().subscribe(data => {
    this.odobreniKorisnici=data||[]
  })

  this.userServis.neodobreniKorisnici().subscribe(data => {
    this.neodobreniKorisnici=data||[]
  })
}

odbijRegistraciju(korIme:string){
  this.userServis.odbijKorisnika(korIme).subscribe(data=>{
    if(data){
           this.userServis.neodobreniKorisnici().subscribe(data=>{
            if(data.length>0){
              this.neodobreniKorisnici=data
            }
            else{
              this.neodobreniKorisnici=[]
            }
          })
    }
    else{
      this.poruka="Došlo je do greške prilikom odbijanja zahteva za registraciju korisnika "+korIme
    }
    this.dohvatiKorisnike()
  })

}

prihvatiRegistraciju(korIme:string){
  this.userServis.prihvatiKorisnika(korIme).subscribe(data=>{
    if(data){
           this.userServis.odobreniKorisnici().subscribe(data=>{
            if(data.length>0){
              this.odobreniKorisnici=data
            }
          })
    }
    else{
      this.poruka="Došlo je do greške prilikom prihvatanja zahteva za registraciju korisnika "+korIme
    }
    this.dohvatiKorisnike()
  })
}

obrisiKorisnika(korIme:string){
  this.userServis.obrisiKorisnika(korIme).subscribe(data=>{
    if(data){
              this.userServis.odobreniKorisnici().subscribe(data=>{
            if(data.length>0){
              this.odobreniKorisnici=data
            }
            else{
              this.odobreniKorisnici=[]
            }
          })
            }
            else{
              this.poruka="Došlo je do greške prilikom brisanja naloga korisnika "+korIme
            }
            this.dohvatiKorisnike()
          })
}

azurirajKorisnika(korIme:string){
  let moze=false
  this.odobreniKorisnici.forEach(korisnik=>{
    if(korisnik.korisnicko_ime==korIme){
       moze=true
      this.korisnikKojegAzuriram=korisnik
      }
  })
  if(!moze) return
   this.userServis.adminAzuriraKorisnika(korIme, this.korisnikKojegAzuriram).subscribe(data=>{
    if(data){
      this.userServis.odobreniKorisnici().subscribe(data=>{
            if(data.length>0){
              this.odobreniKorisnici=data
            }
          })
    }
    else{
      this.poruka="Došlo je do greške prilikom ažuriranja podataka korisnika "+korIme
    }
    this.dohvatiKorisnike()
  })
}

logout(){
  this.userServis.logout()
  this.ruter.navigate([''])
}

   http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  poruka=""

  odobreniKorisnici:Korisnik[]=[]
  neodobreniKorisnici:Korisnik[]=[]

  korisnicko_ime=""

  korisnik:Korisnik=new Korisnik()

  korisnikKojegAzuriram:Korisnik=new Korisnik()


  ime=""
  prezime=""
  profilna=""
  mejl=""
}
