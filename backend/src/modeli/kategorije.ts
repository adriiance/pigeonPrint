import mongoose from "mongoose";


const Schema = mongoose.Schema;

let Kategorije = new Schema({
  naziv: {
    type: String
  },

  potkategorije: {
    type: [String]
  }
});

export default mongoose.model<any>(
  "KategorijeModel",
  Kategorije,
  "kategorije"
);