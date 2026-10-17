import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Klijentservis } from '../../servisi/klijentservis';
import { Proizvodservis } from '../../servisi/proizvodservis';
import { Fakturaservis } from '../../servisi/fakturaservis';
import { StavkaArhive, StavkaKorpe } from '../../modeli/StavkaKorpe';
import { Faktura } from '../../modeli/Faktura';
import { Korisnik } from '../../modeli/Korisnik';

@Component({
  selector: 'app-fizickolice',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './fizickolice.html',
  styleUrl: './fizickolice.css',
})
export class Fizickolice implements OnInit{
  nazad(){
  //  this.userServis.logout()
    this.ruter.navigate([''])
  }
logout(){
  localStorage.removeItem("tip")
localStorage.removeItem("podtip")
localStorage.removeItem("ulogovaniKorisnik")
localStorage.removeItem("korisnicko_ime")
this.ruter.navigate([''])
}
  ngOnInit(): void {
    this.korisnicko_ime=localStorage.getItem("korisnicko_ime")+""
    if(localStorage.getItem("korisnicko_ime")){
      this.fakture=[]
      this.arhivaProizvoda=[]
      this.userServis.ulogovaniKorisnik(this.korisnicko_ime).subscribe(data=>{
        if(data){
          this.korisnik=data
          this.ime=data.ime
          this.prezime=data.prezime
          this.mejl=data.mejl
          this.telefon=data.telefon
          this.profilna=data.profilna
         this.previewProfilne= this.putanjaProfilne(this.profilna)

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

  promeniStatus(sifraProizvoda:String){
    this.arhivaProizvoda.forEach(proizvod=>{
      if(proizvod.sifraProizvoda==sifraProizvoda){
        this.fakturaServis.promeniStatusProizvoda(proizvod.idFakture, sifraProizvoda+"").subscribe(data=>{
          if(data){
           proizvod.status="primljeno"
          }
          else{
            this.poruka="Došlo je do greške prilikom prijema pošiljke, molimo probajte ponovo!"
          }
        })
      }
    })
  }

   http=inject(HttpClient)
  ruter=inject(Router)
  userServis=inject(Klijentservis)
  proizvodServis=inject(Proizvodservis)
  fakturaServis=inject(Fakturaservis)
  stavke:StavkaKorpe[]=[]
  poruka=""
  fakture:Faktura[]=[]
  arhivaProizvoda:StavkaArhive[]=[]

  korisnicko_ime=""

  korisnik:Korisnik=new Korisnik()

  ime=""
  prezime=""
  profilna=""
  mejl=""
  telefon=""

  menjanjeAktivno=false

  dohvatiKomentare(sifraProizvoda:string){
      this.proizvodServis.najnovijiKomentari(sifraProizvoda).subscribe(data=>{
          this.arhivaProizvoda.forEach(proizvod=>{
            if(proizvod.sifraProizvoda==sifraProizvoda){
              if(data.length>0){proizvod.komentari=data}
              else{proizvod.komentari=[]}
            }
          })
        })
    }

    tekstKomentara=""

    komentarisi(sifraProizvoda:string){
    if(this.moguReagovati(sifraProizvoda)){
      this.proizvodServis.komentarisi(this.korisnicko_ime, sifraProizvoda, this.tekstKomentara).subscribe(data=>{
        if(data){
          this.tekstKomentara=""
          this.dohvatiKomentare(sifraProizvoda)
        }
        else{
          this.poruka="Došlo je do greške prilikom postavljanja vašeg komentara. Probajte ponovo!"
        }
      })
    }
    }


  moguReagovati(sifraProizvoda:string){
     let moze=false
    this.arhivaProizvoda.forEach(proizvod=>{
      if(proizvod.sifraProizvoda==sifraProizvoda && proizvod.status=="primljeno") moze=true
    })
    return moze
  }

  lajk(sifraProizvoda:string){

    if(!this.moguReagovati(sifraProizvoda)) return
    this.proizvodServis.reaguj(this.korisnicko_ime, sifraProizvoda, "lajk").subscribe(data=>{
      if(data){
        let lajkovao=false
    let dislajkovao=false
    this.arhivaProizvoda.forEach(proizvodArhive=>{
      if(proizvodArhive.sifraProizvoda==sifraProizvoda){
        proizvodArhive.proizvod.lajkovali.forEach(korisnik=>{
          if(korisnik==this.korisnicko_ime){
            lajkovao=true
          }
        })
         proizvodArhive.proizvod.dislajkovali.forEach(korisnik=>{
          if(korisnik==this.korisnicko_ime){
            dislajkovao=true
          }
        })
        if(lajkovao){
          let noviLajkovi:string[]=[]
          proizvodArhive.proizvod.lajkovali.forEach(korisnik=>{
            if(korisnik!=this.korisnicko_ime){
              noviLajkovi.push(korisnik)
            }
          })
          proizvodArhive.proizvod.lajkovali=noviLajkovi
        }
       else  if(dislajkovao){
          let noviLajkovi:string[]=[]
          proizvodArhive.proizvod.dislajkovali.forEach(korisnik=>{
            if(korisnik!=this.korisnicko_ime){
              noviLajkovi.push(korisnik)
            }
          })
          proizvodArhive.proizvod.dislajkovali=noviLajkovi
          proizvodArhive.proizvod.lajkovali.push(this.korisnicko_ime)
        }
        if(!lajkovao && !dislajkovao) proizvodArhive.proizvod.lajkovali.push(this.korisnicko_ime)
      }
    })
      }
    })
  }

  dislajk(sifraProizvoda:string){
        if(!this.moguReagovati(sifraProizvoda)) return
     this.proizvodServis.reaguj(this.korisnicko_ime, sifraProizvoda, "dislajk").subscribe(data=>{
      if(data){

    let lajkovao=false
    let dislajkovao=false
    this.arhivaProizvoda.forEach(proizvodArhive=>{
      if(proizvodArhive.sifraProizvoda==sifraProizvoda){
        proizvodArhive.proizvod.lajkovali.forEach(korisnik=>{
          if(korisnik==this.korisnicko_ime){
            lajkovao=true
          }
        })
         proizvodArhive.proizvod.dislajkovali.forEach(korisnik=>{
          if(korisnik==this.korisnicko_ime){
            dislajkovao=true
          }
        })
          if(dislajkovao){
          let noviLajkovi:string[]=[]
          proizvodArhive.proizvod.dislajkovali.forEach(korisnik=>{
            if(korisnik!=this.korisnicko_ime){
              noviLajkovi.push(korisnik)
            }
          })
          proizvodArhive.proizvod.dislajkovali=noviLajkovi
        }
       else if(lajkovao){
          let noviLajkovi:string[]=[]
          proizvodArhive.proizvod.lajkovali.forEach(korisnik=>{
            if(korisnik!=this.korisnicko_ime){
              noviLajkovi.push(korisnik)
            }
          })
          proizvodArhive.proizvod.lajkovali=noviLajkovi
           proizvodArhive.proizvod.dislajkovali.push(this.korisnicko_ime)
        }
        if(!lajkovao && !dislajkovao) proizvodArhive.proizvod.dislajkovali.push(this.korisnicko_ime)
      }
    })
      }
  })
  }

  otkaziFakturu(id:string){
    this.fakturaServis.otkaziFakuturu(id).subscribe(data=>{
      if(data){
           this.fakturaServis.mojeFakture(this.korisnicko_ime).subscribe(data=>{
            if(data){
              this.fakture=data
            }
            else{
               this.poruka="Postoji problem sa dohvatanjem podataka, probajte ponovo da se logujete :/ "
            }
          })
      }
      else{
        this.poruka="Faktura nije otkazana, probajte ponovo"
      }
    })
  }

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
    this.izabranaProfilna=null
    this.ime= this.korisnik.ime
    this.prezime=this.korisnik.prezime
    this.mejl=this.korisnik.mejl
    this.profilna=this.korisnik.profilna
    this.telefon=this.korisnik.telefon
  }


  azurirajPodatke(){

    this.poruka=""

    if(this.ime=="" || this.prezime=="" || this.telefon=="" || this.mejl==""){
      this.poruka="Ime, prezime, telefon i mejl moraju biti popunjeni."
      return
    }

    if(this.porukaProfilna!="") return

    this.korisnik.ime=this.ime
    this.korisnik.prezime=this.prezime
    this.korisnik.mejl=this.mejl
    this.korisnik.profilna=this.profilna
    this.korisnik.telefon=this.telefon

    this.userServis.azurirajKorisnika(this.korisnik, this.izabranaProfilna).subscribe(data=>{
      if(data){
        this.poruka="Uspesno ste azurirali podatke!!"
        this.ime=data.ime
          this.prezime=data.prezime
          this.mejl=data.mejl
          this.telefon=data.telefon
          this.profilna=data.profilna
          this.izabranaProfilna=null
          this.menjanjeAktivno=false
           this.poruka="Uspešno ste ažurirali podatke!!"
      }
      else{
        this.poruka="Došlo je do greške prilikom ažuriranja podataka. Probajte ponovo!"
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
sortiranjeArhive="datum_novije"
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
  sortirajArhivu(){
    if(this.sortiranjeArhive=="datum_novije"){
      this.arhivaProizvoda.sort((a,b)=>new Date(b.datum).getTime()-new Date(a.datum).getTime())
    }
    if(this.sortiranjeArhive=="datum_starije"){
      this.arhivaProizvoda.sort((a,b)=>new Date(a.datum).getTime()-new Date(b.datum).getTime())
    }
    if(this.sortiranjeArhive=="naziv"){
      this.arhivaProizvoda.sort((a,b)=>a.nazivProizvoda.localeCompare(b.nazivProizvoda))
    }
    if(this.sortiranjeArhive=="kolicina_vece"){
      this.arhivaProizvoda.sort((a,b)=>Number(b.kolicina)-Number(a.kolicina))
    }
    if(this.sortiranjeArhive=="kolicina_manje"){
      this.arhivaProizvoda.sort((a,b)=>Number(a.kolicina)-Number(b.kolicina))
    }
    if(this.sortiranjeArhive=="stamparija"){
      this.arhivaProizvoda.sort((a,b)=>a.nazivStamparije.localeCompare(b.nazivStamparije))
    }
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
