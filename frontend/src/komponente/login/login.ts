import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)


korisnicko_ime=""
lozinka=""

poruka=""

login(){

  this.userServis.login(this.korisnicko_ime, this.lozinka).subscribe(data=>{
    if(!data){
      this.poruka="Niste uneli ispravne podatke za logovanje"
    }
    else{
      localStorage.setItem("korisnicko_ime", this.korisnicko_ime)
      if(data.podtip=="fizicko_lice"){
        this.ruter.navigate(['fizickolice'])
      }
       if(data.podtip=="pravno_lice"){
         this.ruter.navigate(['pravnolice'])
      }
      if(data.tip=="stampar"){
         this.ruter.navigate(['stampar'])
      }
    }
  })
}
registracija(){
this.ruter.navigate(['registracija'])
}
admin(){
this.ruter.navigate(['adminLogin'])
}
}
