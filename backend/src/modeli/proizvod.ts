import mongoose from "mongoose";


const Schema = mongoose.Schema;

let Proizvod = new Schema({
  sifra: {
    type: String
  },

  naziv: {
    type: String
  },

  opis: {
    type: String
  },

 korisnicko_ime_vlasnika: {
    type: String
  },

  boje: {
    type: [String]
  },

  naziv_stamparije: {
    type: String
  },

  lajkovali:{
    type: [String]
  },
dislajkovali:{
    type: [String]
  },

  usluge_stampe: [
  {
    naziv: {
      type: String
    },
    dodatna_cena_po_komadu: {
      type: Number
    },
    max_sirina_mm: {
      type: Number
    },
    max_visina_mm: {
      type: Number
    }
  }
],

  kategorija: {
    type: String
  },

  potkategorija: {
    type: String
  },

  jedinicna_cena: {
    type: Number
  },

  kolicina_na_lageru: {
    type: Number
  },

  broj_lajkova: {
    type: Number
  },

  broj_dislajkova: {
    type: Number
  },

  glavna_slika: {
    type: String
  },

  dodatne_slike: {
    type: [String]
  }
});

export default mongoose.model<any>(
  "ProizvodModel",
  Proizvod,
  "proizvodi"
);