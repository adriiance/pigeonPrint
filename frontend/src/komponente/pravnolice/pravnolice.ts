import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Fakturaservis } from '../../servisi/fakturaservis';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { StavkaArhive, StavkaKorpe } from '../../modeli/StavkaKorpe';
import { Faktura } from '../../modeli/Faktura';
import { Korisnik } from '../../modeli/Korisnik';
import { JavnaNabavka } from '../../modeli/JavnaNabavka';
import { Ponuda } from '../../modeli/JavnaNabavka';
import { Javnanabavkaservis } from '../../servisi/javnanabavkaservis';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pravnolice',
  imports: [FormsModule, RouterOutlet, DatePipe],
  templateUrl: './pravnolice.html',
  styleUrl: './pravnolice.css',
})
export class Pravnolice implements OnInit{
logout(){
  localStorage.removeItem("tip")
localStorage.removeItem("podtip")
localStorage.removeItem("ulogovaniKorisnik")
localStorage.removeItem("korisnicko_ime")
this.ruter.navigate([''])
}
  nazad(){
 //   this.userServis.logout()
    this.ruter.navigate([''])
  }
  ngOnInit(): void {
    this.korisnicko_ime=localStorage.getItem("korisnicko_ime")+""
    if(localStorage.getItem("korisnicko_ime")){
      this.fakture=[]
      this.javneNabavke=[]
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

         //

       this.javnaNabavkaServis.mojeJavneNabavke(this.korisnicko_ime).subscribe(data=>{

    if(data){
        this.javneNabavke=data
        this.porukaNabavke=""
    }
    else{
        this.javneNabavke=[]
        this.porukaNabavke="Još uvek nemate javne nabavke."
    }

    this.fakturaServis.mojeFakture(this.korisnicko_ime).subscribe(data=>{

            if(data){
              this.fakture=data
              this.fakture.forEach(faktura=>{
                faktura.stavke.forEach(stavka=>{
                  if(stavka.status=="isporuceno" || stavka.status=="primljeno"){
                  let proizvod=new StavkaArhive()
                  proizvod.boja=stavka.boja
                  proizvod.datum=faktura.datum
                  proizvod.idFakture=faktura.id_fakture
                  proizvod.kolicina=stavka.kolicina
                  proizvod.nazivProizvoda=stavka.nazivProizvoda
                  proizvod.nazivStamparije=faktura.naziv_stamparije
                  proizvod.sifraProizvoda=stavka.sifraProizvoda
                  proizvod.status=stavka.status
                  proizvod.tipStampe=stavka.tipStampe
                  proizvod.ukupnaCena=stavka.ukupnaCena

                  this.proizvodServis.dohvatiIzabraniProizvod(proizvod.sifraProizvoda).subscribe(data=>{
                    if(data){
                      proizvod.proizvod=data
                      this.arhivaProizvoda.push(proizvod)
                    }
                    else{

                    }
                  })
                  }
                })
              })
            }
            else{
               this.poruka="Postoji problem sa dohvatanjem podataka, probajte ponovo da se logujete :/ "
            }
          })


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
  fakture:Faktura[]=[]
  javneNabavke:JavnaNabavka[]=[]
   arhivaProizvoda:StavkaArhive[]=[]
  sortiranjeArhive="datum_novije"
  tekstKomentara=""

  promeniStatus(idFakture:string, sifraProizvoda:string){
    this.fakturaServis.promeniStatusProizvoda(idFakture, sifraProizvoda).subscribe(data=>{
      if(data){
        let proizvod=this.arhivaProizvoda.find(p=>p.idFakture==idFakture && p.sifraProizvoda==sifraProizvoda)
        if(proizvod) proizvod.status="primljeno"
      }
      else{
        this.poruka="Došlo je do greške prilikom prijema pošiljke, molimo probajte ponovo!"
      }
    })
  }

  moguReagovati(sifraProizvoda:string){
    return this.arhivaProizvoda.some(proizvod=>proizvod.sifraProizvoda==sifraProizvoda && proizvod.status=="primljeno")
  }

  lajk(sifraProizvoda:string){
    if(!this.moguReagovati(sifraProizvoda)) return
    this.proizvodServis.reaguj(this.korisnicko_ime, sifraProizvoda, "lajk").subscribe(data=>{
      if(data){
        this.arhivaProizvoda.forEach(p=>{
          if(p.sifraProizvoda==sifraProizvoda) p.proizvod=data
        })
      }
    })
  }

  dislajk(sifraProizvoda:string){
    if(!this.moguReagovati(sifraProizvoda)) return
    this.proizvodServis.reaguj(this.korisnicko_ime, sifraProizvoda, "dislajk").subscribe(data=>{
      if(data){
        this.arhivaProizvoda.forEach(p=>{
          if(p.sifraProizvoda==sifraProizvoda) p.proizvod=data
        })
      }
    })
  }

  komentarisi(sifraProizvoda:string){
    if(!this.moguReagovati(sifraProizvoda) || this.tekstKomentara.trim()=="") return
    this.proizvodServis.komentarisi(this.korisnicko_ime, sifraProizvoda, this.tekstKomentara).subscribe(data=>{
      if(data){
        this.tekstKomentara=""
      }
      else{
        this.poruka="Došlo je do greške prilikom postavljanja vašeg komentara. Probajte ponovo!"
      }
    })
  }


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
//naziv institucije, adresu sedišta, grad, matični broj i PIB
  menjanjeAktivno=false
  porukaMB=""
  porukaPIB=""
  porukaNabavke=""




  promeniPodatke(){
    this.menjanjeAktivno=true
    this.menjanjeAktivno=true
    this.poruka=""
    this.porukaProfilna=""
    this.izabranaProfilna=null
    this.previewProfilne=this.putanjaProfilne(this.profilna)
  }

   odustaniOdIzmena(){
    this.menjanjeAktivno=false
    this.porukaProfilna=""
    this.porukaMB=""
    this.porukaPIB=""
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
    sortirajArhivu(){
    if(this.sortiranjeArhive=="datum_novije") this.arhivaProizvoda.sort((a,b)=>new Date(b.datum).getTime()-new Date(a.datum).getTime())
    if(this.sortiranjeArhive=="datum_starije") this.arhivaProizvoda.sort((a,b)=>new Date(a.datum).getTime()-new Date(b.datum).getTime())
    if(this.sortiranjeArhive=="naziv") this.arhivaProizvoda.sort((a,b)=>a.nazivProizvoda.localeCompare(b.nazivProizvoda))
    if(this.sortiranjeArhive=="kolicina_vece") this.arhivaProizvoda.sort((a,b)=>Number(b.kolicina)-Number(a.kolicina))
    if(this.sortiranjeArhive=="kolicina_manje") this.arhivaProizvoda.sort((a,b)=>Number(a.kolicina)-Number(b.kolicina))
    if(this.sortiranjeArhive=="stamparija") this.arhivaProizvoda.sort((a,b)=>a.nazivStamparije.localeCompare(b.nazivStamparije))
  }

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

  sortirajFakture(){
    if(this.sortiranje=="datum_novije"){
      this.fakture.sort((a,b)=>new Date(b.datum).getTime()-new Date(a.datum).getTime())
    }
    if(this.sortiranje=="datum_starije"){
      this.fakture.sort((a,b)=>new Date(a.datum).getTime()-new Date(b.datum).getTime())
    }
    if(this.sortiranje=="iznos_veci"){
      this.fakture.sort((a,b)=>b.ukupni_iznos-a.ukupni_iznos)
    }
    if(this.sortiranje=="iznos_manji"){
      this.fakture.sort((a,b)=>a.ukupni_iznos-b.ukupni_iznos)
    }
    if(this.sortiranje=="stamparija"){
      this.fakture.sort((a,b)=>a.naziv_stamparije.localeCompare(b.naziv_stamparije))
    }
  }

}
