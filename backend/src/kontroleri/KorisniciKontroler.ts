import * as express from "express";
import KorisnikModel from "../modeli/korisnik"
  import bcrypt from "bcrypt";



export class KorisniciKontroler {

  postojeciMaticni= async (req: express.Request, res: express.Response) => {
  let postojeciMaticni = await KorisnikModel.findOne({
  maticni_broj: req.body.maticni_broj,
  korisnicko_ime: { $ne: req.body.korisnicko_ime }
})
res.json(postojeciMaticni)
  }

  postojeciPib= async (req: express.Request, res: express.Response) => {
  let postojeciPib = await KorisnikModel.findOne({
  pib: req.body.pib,
  korisnicko_ime: { $ne: req.body.korisnicko_ime }
})
res.json(postojeciPib)
  }

  ulogovaniKorisnik= async (req: express.Request, res: express.Response) => {
    let korIme=req.body.korIme
    let korisnik = await KorisnikModel.findOne({korisnicko_ime:korIme});
   // console.log(korisnik.ime)
     res.json(korisnik);
      return;
  }

  adminSklanjaProfilnu= async (req: express.Request, res: express.Response) => {
     let korisnicko_ime=req.body.korisnicko_ime
let izmene:any={
      profilna:"default_profile_image.jpg"
    }
     let rezultat=await KorisnikModel.findOneAndUpdate(
      {korisnicko_ime:korisnicko_ime},
      {$set:izmene},
      {new:true}
    )

    res.json(rezultat);
    return;
  }

  
  adminAzuriraKorisnika= async (req: express.Request, res: express.Response) => {
     let korisnicko_ime=req.body.korisnicko_ime
    let ime=req.body.ime
    let prezime=req.body.prezime
    let mejl=req.body.mejl
    let telefon=req.body.telefon
    let pib=req.body.pib
    let maticni_broj=req.body.maticni_broj
    let grad=req.body.grad 
    let adresa_sedista=req.body.adresa_sedista

    let drugiKorisnikSaMejlom=await KorisnikModel.findOne({
      mejl:mejl,
      korisnicko_ime:{$ne:korisnicko_ime}
    })
    if(drugiKorisnikSaMejlom){
      res.json(null)
      return
    }

    let izmene:any={
      ime:ime,
      prezime:prezime,
      mejl:mejl,
      telefon:telefon,
      maticni_broj:maticni_broj,
      grad:grad,
      pib:pib,
      adresa_sedista:adresa_sedista
    }

    let rezultat=await KorisnikModel.findOneAndUpdate(
      {korisnicko_ime:korisnicko_ime},
      {$set:izmene},
      {new:true}
    )

    res.json(rezultat);
    return;
  }

  azurirajKorisnika= async (req: express.Request, res: express.Response) => {
    let korisnicko_ime=req.body.korisnicko_ime
    let ime=req.body.ime
    let prezime=req.body.prezime
    let mejl=req.body.mejl
    let telefon=req.body.telefon
    let pib=req.body.pib
    let maticni_broj=req.body.maticni_broj
    let grad=req.body.grad 
    let adresa_sedista=req.body.adresa_sedista

    let drugiKorisnikSaMejlom=await KorisnikModel.findOne({
      mejl:mejl,
      korisnicko_ime:{$ne:korisnicko_ime}
    })
    if(drugiKorisnikSaMejlom){
      res.json(null)
      return
    }

    let izmene:any={
      ime:ime,
      prezime:prezime,
      mejl:mejl,
      telefon:telefon,
      maticni_broj:maticni_broj,
      grad:grad,
      pib:pib,
      adresa_sedista:adresa_sedista
    }
    if(req.file){
      izmene.profilna=req.file.filename
    }

    let rezultat=await KorisnikModel.findOneAndUpdate(
      {korisnicko_ime:korisnicko_ime},
      {$set:izmene},
      {new:true}
    )

    res.json(rezultat);
    return;
  }

  korisnickaImena= async (req: express.Request, res: express.Response) => {
    let korisnici:String[]=[];
   const users = await KorisnikModel.find();
      if (users == null) {
      res.json(korisnici);
      return;
    }
    users.forEach(user=>{
      korisnici.push(user.korisnicko_ime);
    });
    res.json(korisnici);
    
  }

  pibovi= async (req: express.Request, res: express.Response) => {
    let pibovi:String[]=[];
    const users = await KorisnikModel.find();
      if (users == null) {
      res.json(pibovi);
      return;
      }
    users.forEach(user=>{
      pibovi.push(user.pib);
    });
    res.json(pibovi);
    }
  

  mejlovi= async(req: express.Request, res: express.Response) => {
    let mejlovi:String[]=[];
   const users = await KorisnikModel.find();
      if (users == null) {
      res.json(mejlovi);
      return;
    }
    users.forEach(user=>{
      mejlovi.push(user.mejl);
    });
    res.json(mejlovi);
    }
  

  maticniBrojevi= async(req: express.Request, res: express.Response) => {
    let maticniBrojevi:String[]=[];
   const users = await KorisnikModel.find();
      if (users == null) {
      res.json(maticniBrojevi);
      return;
    }
    users.forEach(user=>{
      maticniBrojevi.push(user.maticni_broj);
    });
    res.json(maticniBrojevi);
    
  }

  gradStamparije= async(req: express.Request, res: express.Response) => {
    let grad=""
    let korIme=req.body.korisnicko_ime
    let stamparija = await KorisnikModel.findOne({korisnicko_ime:korIme});
    if(stamparija){
      grad=stamparija.grad;
    }
  res.json(grad)
  }

  lokacijaStamparije = async(req: express.Request, res: express.Response) => {
    let korIme = req.body.korisnicko_ime
    let stamparija = await KorisnikModel.findOne({korisnicko_ime:korIme})
    if(stamparija){
        res.json({grad:stamparija.grad,adresa_sedista:stamparija.adresa_sedista})
    }
    else{
        res.json(null)
    }
}
    stamparije= async(req: express.Request, res: express.Response) => {
   const users = await KorisnikModel.find();
      if (users == null) {
      res.json(null);
      return;
    }
    let stamparije=new Array();
    let found=false
    users.forEach(user=>{
      if(user.tip=="stampar" && user.odobren==true){
        found=true
        stamparije.push(user)
      }
      
    });
    if(!found){res.json(null);
      return;}
   res.json(stamparije);
    }

   odobreniKorisnici = async(req: express.Request, res: express.Response) => {
    let korisnici= await KorisnikModel.find({odobren:true });
    res.json(korisnici)
   }

   neodobreniKorisnici = async(req: express.Request, res: express.Response) => {
    let korisnici= await KorisnikModel.find({odobren:false });
    res.json(korisnici)
   }

   prihvatiKorisnika= async(req: express.Request, res: express.Response) => {
    let korisnicko_ime=req.body.korisnicko_ime
    let korisnici= await KorisnikModel.findOne({korisnicko_ime:korisnicko_ime, odobren:false });
    if(!korisnici){
      res.json(null)
      return
    }
    korisnici.odobren=true
    korisnici= await korisnici.save()
    res.json(korisnici)
   }

   odbijKorisnika= async(req: express.Request, res: express.Response) => {
    let korisnicko_ime=req.body.korisnicko_ime
    let korisnici= await KorisnikModel.findOneAndDelete({korisnicko_ime:korisnicko_ime, odobren:false });
    if(!korisnici){
      res.json(null)
      return
    }
    res.json(korisnici)
   }

   obrisiKorisnika= async(req: express.Request, res: express.Response) => {
    let korisnicko_ime=req.body.korisnicko_ime
    let korisnici= await KorisnikModel.findOneAndDelete({korisnicko_ime:korisnicko_ime});
    if(!korisnici){
      res.json(null)
      return
    }
    res.json(korisnici)
   }

  login = async(req: express.Request, res: express.Response) => {
    let kor_ime = req.body.korisnicko_ime;
    let lozinka = req.body.lozinka;

   let user= await KorisnikModel.findOne({ korisnicko_ime: kor_ime, odobren:true });
    if (user == null) {
      res.json(null);
      return;
    }

    const passwordMatches = await bcrypt.compare(
      lozinka,
      user.lozinka
    );

    if (!passwordMatches) {
      res.json(null);
      return;
    }

    res.json(user);
  

  };


  registracija= async (req: express.Request, res: express.Response) => {
    let profilna="default_profile_image.jpg"

    if(req.file){
      profilna=req.file.filename;
    }

   let korisnicko_ime=req.body.korisnicko_ime;
   let lozinka=req.body.lozinka;
   let ime=req.body.ime;
   let prezime=req.body.prezime;
   let telefon=req.body.telefon;
   let mejl=req.body.mejl;
   let tip=req.body.tip;
   let podtip=req.body.podtip;
   let naziv_institucije=req.body.naziv_institucije;
   let adresa_sedista=req.body.adresa_sedista;
   let grad=req.body.grad;
   let maticni_broj=req.body.maticni_broj;
   let pib=req.body.pib;
   let odobren=false;

    const hesiranaLozinka = await bcrypt.hash(lozinka, 10);

   let user=await KorisnikModel.findOne({ korisnicko_ime: korisnicko_ime });
    if (user == null) {
    //nema problema sa korisnickim imenom
    }
    else{
       res.json(null);
      return;
    }
  

     user= await KorisnikModel.findOne({ mejl: mejl });
    if (user == null) {
   
    }
    else{
       res.json(null);
      return;
    }
  

  if(maticni_broj!=""){
 user= await KorisnikModel.findOne({ maticni_broj: maticni_broj });
    if (user == null) {
  
    }
    else{
       res.json(null);
      return;
    }
  
  }
  else{
    maticni_broj=null;
  }

if(pib!=""){
user=await KorisnikModel.findOne({ pib: pib });
    if (user == null) {
  
    }
    else{
       res.json(null);
      return;
    }
  
}
else{
  pib=null;
}
if(naziv_institucije=="")naziv_institucije=null;
if(adresa_sedista=="")adresa_sedista=null;
if(grad=="")grad=null;
const noviKorisnik = new KorisnikModel({
  korisnicko_ime:korisnicko_ime,
  lozinka:hesiranaLozinka,
  ime:ime,
  prezime:prezime,
  telefon:telefon,
  mejl:mejl,
  profilna:profilna,
  tip:tip,
  podtip:podtip,
  odobren:odobren,
  naziv_institucije:naziv_institucije,
  adresa_sedista:adresa_sedista,
  grad:grad,
  maticni_broj:maticni_broj,
  pib:pib});
  
  await noviKorisnik.save();
  res.json(noviKorisnik);
  }
  
  };





