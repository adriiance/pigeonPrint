import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Komentar = new Schema({
    korisnicko_ime: {
        type: String
    },
    sifra_proizvoda: {
        type: String
    },
    tekst: {
        type: String
    },
    datum: {
        type: Date
    }
})

export default mongoose.model<any>(
  "KomentarModel",
  Komentar,
  "komentari"
);