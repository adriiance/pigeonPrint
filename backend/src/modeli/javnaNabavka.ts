
import mongoose from "mongoose";

const Schema = mongoose.Schema;


let JavnaNabavka = new Schema({
  id_nabavke : {
    type: String
  },

  korisnicko_ime_klijenta: {
    type: String
  },

  naziv_institucije: {
    type: String
  },

  status: {
    type: String
  },

  datum: {
    type: Date
  },

  stavke: {
    type: [{
      status: {
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
  },

  ponude:[{
     iznos:{
        type: Number
     },
  korisnicko_ime_stampara:{
    type:String
  }
  }],
  pobednik:{
    type:String
  }
});

export default mongoose.model<any>(
  "JavnaNabavkaModel",
  JavnaNabavka,
  "javneNabavke"
);