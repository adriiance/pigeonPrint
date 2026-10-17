import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Korisnik = new Schema({
  ime: {
    type: String
  },

  prezime: {
    type: String
  },

  korisnicko_ime: {
    type: String
  },

  lozinka: {
    type: String
  },

  mejl: {
    type: String
  },

  adresa_sedista: {
    type: String
  },

  grad: {
    type: String
  },

  telefon: {
    type: String
  },

  podtip: {
    type: String
  },

  tip: {
    type: String
  },

  pib: {
    type: String
  },

  odobren: {
    type: Boolean
  },

  profilna: {
    type: String
  },

  naziv_institucije: {
    type: String
  },

  maticni_broj: {
    type: String
  }
});

export default mongoose.model<any>(
  "KorisnikModel",
  Korisnik,
  "korisnici"
);