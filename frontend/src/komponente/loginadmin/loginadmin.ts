import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loginadmin',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './loginadmin.html',
  styleUrl: './loginadmin.css',
})
export class Loginadmin {
  http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)


korisnicko_ime=""
lozinka=""

poruka=""

login(){

  this.userServis.login(this.korisnicko_ime, this.lozinka).subscribe(data=>{
     if (!data || data.tip !== "admin") {
      this.poruka = "Niste uneli ispravne podatke za administratorsko logovanje";
    }
    else{
      localStorage.setItem("korisnicko_ime", this.korisnicko_ime)

         this.ruter.navigate(['admin'])

    }
  })


}
}
