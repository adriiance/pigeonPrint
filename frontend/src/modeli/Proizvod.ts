export class Proizvod {
    sifra = ""
    naziv = ""
    opis = ""
    kategorija = ""
    potkategorija = ""
    korisnicko_ime_vlasnika = ""
    naziv_stamparije = ""

    jedinicna_cena = 0
    kolicina_na_lageru = 0

    boje: string[] = []

    glavna_slika = ""
    dodatne_slike: string[] = []

    broj_lajkova = 0
    broj_dislajkova = 0

    lajkovali: string[] = []
dislajkovali: string[] = []

    usluge_stampe: UslugaStampe[] = []
}

export class UslugaStampe {
    naziv = ""
    dodatna_cena_po_komadu = 0
    max_sirina_mm = 0
    max_visina_mm = 0
}

export class Kategorija{
  naziv=""
  potkategorije: String[]=[]
}
