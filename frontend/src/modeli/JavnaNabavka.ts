import { StavkaKorpe } from "./StavkaKorpe"

export class JavnaNabavka {
  id_nabavke=""
  korisnicko_ime_klijenta=""
  naziv_institucije=""
  datum=new Date()
  stavke:StavkaKorpe[]=[]
  status="otvorena"
  ponude:Ponuda[]=[]
  pobednik=""
}

export class Ponuda{
  iznos=0
  korisnicko_ime_stampara=""
}
