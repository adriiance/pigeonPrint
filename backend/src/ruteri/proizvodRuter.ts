import express from "express";
import multer from "multer"

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "pics/")
  },

  filename: function(req, file, cb) {
    const jedinstvenoIme =
      Date.now() + "-" + Math.round(Math.random() * 1000000) + "-" + file.originalname

    cb(null, jedinstvenoIme)
  }
})

const upload = multer({ storage: storage })



 import { ProizvodKontroler } from "../kontroleri/ProizvodKontroler";

const proizvodRuter = express.Router();

proizvodRuter.route("/dodajSlike").post(
  upload.fields([
    { name: "glavna", maxCount: 1 },
    { name: "dodatne", maxCount: 3 }
  ]),
  (req, res) => new ProizvodKontroler().dodajSlike(req, res)
)

proizvodRuter
  .route("/top5")
  .get((req, res) => new ProizvodKontroler().proizvodiTop5(req, res));
proizvodRuter
  .route("/dostupni")
  .get((req, res) => new ProizvodKontroler().sviProizvodi(req, res));
proizvodRuter
  .route("/izabraniProizvod")
  .post((req, res) => new ProizvodKontroler().izabraniProizvod(req, res)); 
proizvodRuter
  .route("/stampareviProizvodi")
  .post((req, res) => new ProizvodKontroler().stampareviProizvodi(req, res)); 
proizvodRuter
  .route("/promeniStanjeNaLageru")
  .post((req, res) => new ProizvodKontroler().promeniStanjeNaLageru(req, res)); 
proizvodRuter
  .route("/kreirajProizvod")
  .post((req, res) => new ProizvodKontroler().kreirajProizvod(req, res));  
proizvodRuter
  .route("/jedinstvenaSifra")
  .get((req, res) => new ProizvodKontroler().jedinstvenaSifra(req, res));  
proizvodRuter
  .route("/kategorije")
  .get((req, res) => new ProizvodKontroler().sveKategorije(req, res)); 
proizvodRuter
  .route("/dohvatiPoslednjihPetKomentara")
  .post((req, res) => new ProizvodKontroler().dohvatiPoslednjihPetKomentara(req, res));  
proizvodRuter
  .route("/dodajKomentar")
  .post((req, res) => new ProizvodKontroler().dodajKomentar(req, res)); 
proizvodRuter
  .route("/reaguj")
  .post((req, res) => new ProizvodKontroler().reaguj(req, res));   
//reaguj
export default proizvodRuter;
