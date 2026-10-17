import express from "express";

 import { ProizvodKontroler } from "../kontroleri/ProizvodKontroler";
import { JavnaNabavkaKontroler } from "../kontroleri/JavnaNabavkaKontroler";

const javnaNabavkaRuter = express.Router();

javnaNabavkaRuter
  .route("/kreirajNabavku")
  .post((req, res) => new JavnaNabavkaKontroler().kreirajNabavku(req, res));

javnaNabavkaRuter
  .route("/dajPonudu")
  .post((req, res) => new JavnaNabavkaKontroler().dajPonudu(req, res));

javnaNabavkaRuter
  .route("/mojeJavneNabavke")
  .post((req, res) => new JavnaNabavkaKontroler().mojeJavneNabavke(req, res));
  
javnaNabavkaRuter
  .route("/otvoreneJavneNabavke")
  .get((req, res) => new JavnaNabavkaKontroler().otvoreneJavneNabavke(req, res));   


export default javnaNabavkaRuter;
