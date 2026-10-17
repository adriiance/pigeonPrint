import { StavkaKorpe } from "./StavkaKorpe"

export class Faktura{
  id_fakture = ""
  korisnicko_ime_klijenta=""
  korisnicko_ime_stampara=""
  naziv_stamparije=""
  grad_stamparije=""
  stavke:StavkaKorpe[]=[]
  ukupni_iznos=0
  status="naruceno"
  datum=new Date()
}
