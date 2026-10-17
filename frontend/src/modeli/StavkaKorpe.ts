import { Komentar } from "./Komentar"
import { Proizvod } from "./Proizvod"

export class StavkaKorpe{
sifraProizvoda=""
nazivProizvoda=""
korisnickoImeStampara=""
boja=""
tipStampe=""
kolicina=0
jedinicnaCena=0
dodatnaCenaStampe=0
ukupnaCena=0
glavnaSlika=""
status="naruceno"
}

export class  GrupaKorpe{
  korisnicko_ime_stampara:string=""
  nazivStamparije:string=""
  stavke:StavkaKorpe[]=[]
  ukupno:number=0
}

export class StavkaArhive{
    idFakture:string=""
    datum:Date= new Date()
    nazivStamparije:string=""
    sifraProizvoda:string=""
    nazivProizvoda:string=""
    boja:string=""
    tipStampe:string=""
    kolicina:Number=0
    ukupnaCena:Number=0
    status:string=""
    proizvod:Proizvod=new Proizvod()
    komentari:Komentar[]=[]
}
