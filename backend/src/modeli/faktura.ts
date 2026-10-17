import mongoose from "mongoose";

const Schema = mongoose.Schema;


let Faktura = new Schema({
  id_fakture : {
    type: String
  },

  korisnicko_ime_klijenta: {
    type: String
  },

  korisnicko_ime_stampara: {
    type: String
  },

  naziv_stamparije: {
    type: String
  },

  grad_stamparije: {
    type: String
  },

  status: {
    type: String
  },

ukupni_iznos: {
    type: Number
  },

  datum: {
    type: Date
  },

  stavke: {
    type: [{
   status:   {
    type: String
  }, 
  sifraProizvoda: {
    type: String
  },

  nazivProizvoda: {
    type: String
  },

  boja: {
    type: String
  },

  tipStampe: {
    type: String
  },

  kolicina: {
    type: Number
  },

  jedinicnaCena: {
    type: Number
  },

  dodatnaCenaStampe: {
    type: Number
  },

  ukupnaCena: {
    type: Number
  }
}]
  }
});

export default mongoose.model<any>(
  "FakturaModel",
  Faktura,
  "fakture"
);