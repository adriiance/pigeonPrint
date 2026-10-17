import express from "express";

 import { KorisniciKontroler } from "../kontroleri/KorisniciKontroler";
import { FakturaKontroler } from "../kontroleri/FakturaKontroler";

const fakturaRuter = express.Router();


fakturaRuter
  .route("/novaFaktura")
  .post((req, res) => new FakturaKontroler().dodajFakturu(req, res));
  fakturaRuter
  .route("/mojeFakture")
  .post((req, res) => new FakturaKontroler().mojeFakture(req, res));
  fakturaRuter
  .route("/mojeFaktureStampar")
  .post((req, res) => new FakturaKontroler().mojeFaktureStampar(req, res));
 fakturaRuter
  .route("/otkaziFakturu")
  .post((req, res) => new FakturaKontroler().otkaziFakturu(req, res));
fakturaRuter
  .route("/promeniStatusFakture")
  .post((req, res) => new FakturaKontroler().promeniStatusFakture(req, res));
fakturaRuter
  .route("/promeniStatusProizvoda")
  .post((req, res) => new FakturaKontroler().promeniStatusProizvoda(req, res)); 

export default fakturaRuter;
