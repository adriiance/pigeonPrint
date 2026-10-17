import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Fakturaservis } from '../../servisi/fakturaservis';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { StavkaKorpe } from '../../modeli/StavkaKorpe';
import { Faktura } from '../../modeli/Faktura';
import { Korisnik } from '../../modeli/Korisnik';
import { JavnaNabavka } from '../../modeli/JavnaNabavka';
import { Ponuda } from '../../modeli/JavnaNabavka';
import { Javnanabavkaservis } from '../../servisi/javnanabavkaservis';
import { DatePipe } from '@angular/common';
import { Proizvod } from '../../modeli/Proizvod';

@Component({
  selector: 'app-stampar',
  imports: [FormsModule, RouterOutlet, DatePipe],
  templateUrl: './stampar.html',
  styleUrl: './stampar.css',
})
export class Stampar implements OnInit{
  ngOnInit(): void {
    this.korisnicko_ime=localStorage.getItem("korisnicko_ime")+""
    if(localStorage.getItem("korisnicko_ime")){
     this.proizvodi=[]
      this.javneNabavke=[]
      this.fakture=[]
      this.userServis.ulogovaniKorisnik(this.korisnicko_ime).subscribe(data=>{
        if(data){
          this.korisnik=data
          this.ime=data.ime
          this.prezime=data.prezime
          this.mejl=data.mejl
          this.telefon=data.telefon
          this.profilna=data.profilna
         this.previewProfilne= this.putanjaProfilne(this.profilna)
         this.naziv_institucije=data.naziv_institucije+""
          this.adresa_sedista=data.adresa_sedista+""
          this.grad=data.grad+""
          this.maticni_broj=data.maticni_broj+""
          this.pib=data.pib+""

         this.proizvodServis.stampareviProizvodi(this.korisnicko_ime).subscribe(data=>{
          if(data){
            this.proizvodi=data
          }
          else{
            this.porukaProizvodi="nemate nijedan proizvod u ponudi"
          }
         })

          this.javnaNabavkaServis.otvoreneJavneNabavke().subscribe(data=>{
                if(data){
                  this.javneNabavke=data
                   this.porukaNabavke=""
                }
                else{
                  this.porukaNabavke="Još uvek nemate javne nabavke."
                }
              })

         this.fakturaServis.mojeFaktureStampar(this.korisnicko_ime).subscribe(data=>{
          if(data){
            this.fakture=data
          }
         })


        }
        else{
          this.poruka="Postoji problem sa dohvatanjem podataka, probajte ponovo da se logujete :/ "
        }
      })

    }
    else{
      this.poruka="Postoji problem sa dohvatanjem podataka, probajte ponovo da se logujete :/ "
    }
  }

   http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  fakturaServis=inject(Fakturaservis)
  javnaNabavkaServis=inject(Javnanabavkaservis)
  stavke:StavkaKorpe[]=[]
  poruka=""
  proizvodi:Proizvod[]=[]
  fakture:Faktura[]=[]
  javneNabavke:JavnaNabavka[]=[]

  korisnicko_ime=""

  korisnik:Korisnik=new Korisnik()

  ime=""
  prezime=""
  profilna=""
  mejl=""
  telefon=""
  naziv_institucije=""
  adresa_sedista=""
  grad=""
  maticni_broj=""
  pib=""
  menjanjeAktivno=false
  porukaMB=""
  porukaPIB=""
  porukaNabavke=""
  porukaProizvodi=""
  promenaKolicineAktivna=false
  novoStanje=0;
  logout(){
  localStorage.removeItem("tip")
localStorage.removeItem("podtip")
localStorage.removeItem("ulogovaniKorisnik")
localStorage.removeItem("korisnicko_ime")
this.ruter.navigate([''])
}

  mojaPonuda(idNabavka:string){
  let iznos = 0
  this.javneNabavke.forEach(nabavka => {
    if(nabavka.id_nabavke == idNabavka){
      nabavka.ponude.forEach(ponuda => {
        if(ponuda.korisnicko_ime_stampara == this.korisnicko_ime){iznos = ponuda.iznos}
      })
    }
  })
  return iznos
}

  imamDovoljno(naziv:string, potrebno:number){
    let imam=false
    this.proizvodi.forEach(proizvod=>{
      if(proizvod.naziv==naziv){
        if(proizvod.kolicina_na_lageru>=potrebno) imam=true
      }
    })
    return imam
  }

  moguDaDamPonudu(idNabavka:string){
 let mogu=true
    this.javneNabavke.forEach(nabavka=>{
      if(nabavka.id_nabavke==idNabavka){
        nabavka.ponude.forEach(ponuda=>{
         if(ponuda.korisnicko_ime_stampara==this.korisnicko_ime) {mogu=false}
        })
      }
    })

    if(!mogu){
      return mogu
    }

    this.javneNabavke.forEach(nabavka=>{
      if(nabavka.id_nabavke==idNabavka){
        nabavka.stavke.forEach(stavka=>{
          if(this.imamDovoljno(stavka.nazivProizvoda, stavka.kolicina)==false) mogu=false
        })
      }
    })
    return mogu
  }


  dajPonudu(idNabavka:string, ponuda:number){
    if(ponuda<=0){
      this.poruka = "Unesite ispravan iznos ponude!"
      return
    }
    if(this.moguDaDamPonudu(idNabavka)){
      this.javnaNabavkaServis.dajPonudu(idNabavka, this.korisnicko_ime, ponuda).subscribe(data=>{
        if(data){
          this.javneNabavke.forEach(nabavka=>{
            if(nabavka.id_nabavke==idNabavka){
              let novaPonuda=new Ponuda()
              novaPonuda.iznos=ponuda
              novaPonuda.korisnicko_ime_stampara=this.korisnicko_ime
              nabavka.ponude.push(novaPonuda)
            }
          })
        }
        else{
           this.javnaNabavkaServis.otvoreneJavneNabavke().subscribe(data=>{
                if(data && data.length>0){
                  this.javneNabavke=data
                   this.porukaNabavke=""

                }
                else{
                  this.javneNabavke=[]
                  this.porukaNabavke="Još uvek nemate javne nabavke."
                }
                this.poruka="Ponuda nije prihvaćena. Javna nabavka je možda završena ili ponuda nije validna."
              })

        }
      })
    }
    else{
    this.poruka = "Nemate dovoljno proizvoda na lageru za ovu javnu nabavku!"
    }
  }

  akcija(idFakture:string){
    let noviStatus=""
    this.fakture.forEach(faktura=>{
      if(faktura.id_fakture==idFakture){
        if(!(faktura.status=="isporuceno" || faktura.status=="otkazano")){
          if(faktura.status=="u stampi"){
          noviStatus="isporuceno"
        }
        if(faktura.status=="naruceno"){
          noviStatus="u stampi"
        }
      }
    }
    })
    if(noviStatus==""){
      return
    }
        this.fakturaServis.promeniStatusFakture(idFakture, noviStatus).subscribe(data=>{
          if(!data){
            this.poruka="Došlo je do greške prilikom promene statusa porudžbine!"
          }
          else{
             this.fakture.forEach(faktura=>{
        if(faktura.id_fakture==idFakture){faktura.status=noviStatus }
        })
      }
  })
  }

  skrolujDo(id: string){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block: 'start'});
}

  azurirajLager(){
    this.promenaKolicineAktivna=true
  }

  odustaniOdLagera(){
this.promenaKolicineAktivna=false
  }

  noviProizvod(){
    localStorage.setItem("stampar", this.naziv_institucije)
    this.ruter.navigate(['noviProizvod'])
  }

  pormeniStanjeNaLageru(sifra:string){
      this.proizvodServis.promeniStanjeNaLageru(sifra, this.novoStanje).subscribe(data=>{
        if(!data){
          this.porukaProizvodi="Doslo je do greške prilikom ažuriranja stanja na lageru"
        }
        else{
           this.porukaProizvodi=""
           this.promenaKolicineAktivna=false
           this.ngOnInit()
        }
      })
  }


  promeniPodatke(){
    this.menjanjeAktivno=true
    this.menjanjeAktivno=true
    this.poruka=""
    this.porukaProfilna=""
    this.porukaProizvodi=""
    this.izabranaProfilna=null
    this.previewProfilne=this.putanjaProfilne(this.profilna)
  }

   odustaniOdIzmena(){
    this.menjanjeAktivno=false
    this.porukaProfilna=""
    this.porukaMB=""
    this.porukaPIB=""
     this.porukaProizvodi=""
    this.izabranaProfilna=null
    this.ime= this.korisnik.ime
    this.prezime=this.korisnik.prezime
    this.mejl=this.korisnik.mejl
    this.profilna=this.korisnik.profilna
    this.telefon=this.korisnik.telefon
    this.adresa_sedista=this.korisnik.adresa_sedista+""
    this.grad=this.korisnik.grad+""
    this.maticni_broj=this.korisnik.maticni_broj+""
    this.pib=this.korisnik.pib+""
  }


  azurirajPodatke(){

    this.poruka=""

    if(this.ime=="" || this.prezime=="" || this.telefon=="" || this.mejl=="" ||
      this.maticni_broj=="" || this.grad=="" || this.adresa_sedista=="" || this.pib==""
    ){
      this.poruka="Obavezno je popuniti sva polja!"
      return
    }

    if(this.porukaProfilna!="") return

      let regexMB=/^\d{8}$/
  if(!regexMB.test(this.maticni_broj)){
    this.porukaMB="maticni broj mora imati tacno 8 cifara"
    return
  }

  let regexPib=/^[1-9]\d{8}$/
  if(!regexPib.test(this.pib)){
    this.porukaPIB="PIB mora imati tacno 9 cifara, a prva cifra ne sme biti 0"
    return
  }

  this.userServis.postojeciMaticni(this.korisnicko_ime, this.maticni_broj).subscribe(data=>{
    if(data){
      this.porukaMB="maticni broj mora biti jedinstven"
    return
    }
    else{
      this.userServis.postojeciPib(this.korisnicko_ime, this.pib).subscribe(data=>{
        if(data){
          this.porukaPIB="PIB mora biti jedinstven"
    return
        }
        else{
 this.korisnik.ime=this.ime
    this.korisnik.prezime=this.prezime
    this.korisnik.mejl=this.mejl
    this.korisnik.profilna=this.profilna
    this.korisnik.telefon=this.telefon
    this.korisnik.adresa_sedista=this.adresa_sedista
     this.korisnik.grad=this.grad
     this.korisnik.maticni_broj=this.maticni_broj
     this.korisnik.pib=this.pib


    this.userServis.azurirajKorisnika(this.korisnik, this.izabranaProfilna).subscribe(data=>{
      if(data){
        this.poruka="Uspesno ste azurirali podatke!!"
        this.ime=data.ime
          this.prezime=data.prezime
          this.mejl=data.mejl
          this.telefon=data.telefon
          this.profilna=data.profilna
          this.adresa_sedista=data.adresa_sedista+""
          this.grad=data.grad+""
          this.maticni_broj=data.maticni_broj+""
          this.pib=data.pib+""
          this.izabranaProfilna=null
          this.menjanjeAktivno=false
           this.poruka="Uspešno ste ažurirali podatke!!"
      }
      else{
        this.poruka="Došlo je do greške prilikom ažuriranja podataka. Probajte ponovo!"
      }
    })
        }
      })
    }
  })


  }

  putanjaProfilne(slika:string){

  if(!slika){
    return "http://localhost:4000/pics/default_profile_image.jpg"
  }

  if(slika.startsWith("http")){
    return slika
  }

  if(slika.startsWith("pics/")){
    return "http://localhost:4000/" + slika
  }

  return "http://localhost:4000/pics/" + slika
}

sortiranje="datum_novije"
  izabranaProfilna:File|null=null
  porukaProfilna=""
  previewProfilne=""

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement

    if (!input.files || input.files.length==0) return

    const file=input.files[0]
    const dozvoljeniTipovi=["image/jpeg", "image/png", "image/gif"]

    this.izabranaProfilna=null
    this.porukaProfilna=""

    if (!dozvoljeniTipovi.includes(file.type)) {
      this.porukaProfilna="Dozvoljeni formati su JPG, PNG i GIF."
      input.value=""
      return
    }

    const img=new Image()
    const objectUrl=URL.createObjectURL(file)

    img.onload=()=>{
      if(img.width<100 || img.height<100 || img.width>250 || img.height>250){
        this.porukaProfilna="Slika mora biti između 100x100 i 250x250 piksela."
        this.izabranaProfilna=null
        input.value=""
        URL.revokeObjectURL(objectUrl)
        return
      }

      this.porukaProfilna=""
      this.izabranaProfilna=file
      this.previewProfilne=objectUrl
    }

    img.onerror=()=>{
      this.porukaProfilna="Izabrani fajl nije moguće učitati kao sliku."
      this.izabranaProfilna=null
      input.value=""
      URL.revokeObjectURL(objectUrl)
    }

    img.src=objectUrl
  }




}
