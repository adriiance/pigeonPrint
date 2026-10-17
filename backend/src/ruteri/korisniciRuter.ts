import express from "express";

 import { KorisniciKontroler } from "../kontroleri/KorisniciKontroler";
import multer from "multer";

  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, "pics/");
},

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  }
  else {
    cb(new Error("Dozvoljeni su samo JPG, PNG i GIF fajlovi."));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const korisniciRuter = express.Router();

korisniciRuter
  .route("/ulogovaniKorisnik")
  .post((req, res) => new KorisniciKontroler().ulogovaniKorisnik(req, res));

korisniciRuter
  .route("/postojeciMaticni")
  .post((req, res) => new KorisniciKontroler().postojeciMaticni(req, res)); 
  
korisniciRuter
  .route("/postojeciPib")
  .post((req, res) => new KorisniciKontroler().postojeciPib(req, res));  

korisniciRuter
  .route("/azurirajKorisnika")
  .post(upload.single("profilna"),(req, res) => new KorisniciKontroler().azurirajKorisnika(req, res));

korisniciRuter
  .route("/stamparije")
  .get((req, res) => new KorisniciKontroler().stamparije(req, res));

  korisniciRuter
  .route("/grad")
  .post((req, res) => new KorisniciKontroler().gradStamparije(req, res));
korisniciRuter
  .route("/lokacija")
  .post((req, res) => new KorisniciKontroler().lokacijaStamparije(req, res));

korisniciRuter
  .route("/login")
  .post((req, res) => new KorisniciKontroler().login(req, res));

  korisniciRuter
  .route("/registracija")
  .post( upload.single("profilna"),(req, res) => new KorisniciKontroler().registracija(req, res));

korisniciRuter
  .route("/korisnickaImena")
  .get((req, res) => new KorisniciKontroler().korisnickaImena(req, res));

  korisniciRuter
  .route("/mejlovi")
  .get((req, res) => new KorisniciKontroler().mejlovi(req, res));

korisniciRuter
  .route("/pibovi")
  .get((req, res) => new KorisniciKontroler().pibovi(req, res));

  korisniciRuter
  .route("/maticniBrojevi")
  .get((req, res) => new KorisniciKontroler().maticniBrojevi(req, res));
 
 korisniciRuter
  .route("/odobreniKorisnici")
  .get((req, res) => new KorisniciKontroler().odobreniKorisnici(req, res)); 

korisniciRuter
  .route("/neodobreniKorisnici")
  .get((req, res) => new KorisniciKontroler().neodobreniKorisnici(req, res)); 

korisniciRuter
  .route("/prihvatiKorisnika")
  .post((req, res) => new KorisniciKontroler().prihvatiKorisnika(req, res));  
 
korisniciRuter
  .route("/odbijKorisnika")
  .post((req, res) => new KorisniciKontroler().odbijKorisnika(req, res));  
  
korisniciRuter
  .route("/obrisiKorisnika")
  .post((req, res) => new KorisniciKontroler().obrisiKorisnika(req, res)); 
  
korisniciRuter
  .route("/adminAzuriraKorisnika")
  .post((req, res) => new KorisniciKontroler().adminAzuriraKorisnika(req, res));   
 
  korisniciRuter
  .route("/adminSklanjaProfilnu")
  .post((req, res) => new KorisniciKontroler().adminSklanjaProfilnu(req, res));  

export default korisniciRuter;
