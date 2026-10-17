import * as express from "express";
import ProizvodModel from "../modeli/proizvod"
import KategorijeModel from "../modeli/kategorije"
import KomentarModel from "../modeli/komentar"
import FakturaModel from "../modeli/faktura"

export class ProizvodKontroler {

reaguj= async(req: express.Request, res: express.Response)=>{
let korisnicko_ime= req.body.korisnicko_ime
let idProizvoda= req.body.idProizvoda
let reakcija= req.body.reakcija
let proizvod= await ProizvodModel.findOne({sifra:idProizvoda})
if(!proizvod){
  res.json(null)
  return
}
let faktura= await FakturaModel.findOne({korisnicko_ime_klijenta:korisnicko_ime,
  stavke:{$elemMatch:{sifraProizvoda:idProizvoda,status:"primljeno"}}})
if(!faktura){
    res.json(null)
    return
}
if(reakcija=="lajk"){
if(proizvod.lajkovali.includes(korisnicko_ime)){
  let noviLajkovi:string[]=[]
  for(let i=0; i<proizvod.lajkovali.length; i++){
    if(proizvod.lajkovali[i]!=korisnicko_ime) noviLajkovi.push(proizvod.lajkovali[i])
  }
proizvod.lajkovali=noviLajkovi
}
else if(proizvod.dislajkovali.includes(korisnicko_ime)){
  let noviLajkovi:string[]=[]
  for(let i=0; i<proizvod.dislajkovali.length; i++){
    if(proizvod.dislajkovali[i]!=korisnicko_ime) noviLajkovi.push(proizvod.dislajkovali[i])
  }
proizvod.dislajkovali=noviLajkovi
  proizvod.lajkovali.push(korisnicko_ime)
}
else{
  proizvod.lajkovali.push(korisnicko_ime)
}
}
else if(reakcija=="dislajk"){
if(proizvod.dislajkovali.includes(korisnicko_ime)){
  let noviLajkovi:string[]=[]
  for(let i=0; i<proizvod.dislajkovali.length; i++){
    if(proizvod.dislajkovali[i]!=korisnicko_ime) noviLajkovi.push(proizvod.dislajkovali[i])
  }
proizvod.dislajkovali=noviLajkovi
}
else if(proizvod.lajkovali.includes(korisnicko_ime)){
  let noviLajkovi:string[]=[]
  for(let i=0; i<proizvod.lajkovali.length; i++){
    if(proizvod.lajkovali[i]!=korisnicko_ime) noviLajkovi.push(proizvod.lajkovali[i])
  }
proizvod.lajkovali=noviLajkovi
  proizvod.dislajkovali.push(korisnicko_ime)
}
else{
  proizvod.dislajkovali.push(korisnicko_ime)
}
}
proizvod.broj_lajkova=proizvod.lajkovali.length
proizvod.broj_dislajkova=proizvod.dislajkovali.length
proizvod= await proizvod.save()
 res.json(proizvod)
  return
}  

dohvatiPoslednjihPetKomentara= async(req: express.Request, res: express.Response)=>{
  let sifra=req.body.sifraProizvoda
  let komentari= await KomentarModel.find({sifra_proizvoda: sifra})
    .sort({datum: -1})
    .limit(5)
  res.json(komentari)  
}  

dodajKomentar= async(req: express.Request, res: express.Response)=>{
    let korisnicko_ime = req.body.korisnicko_ime
    let sifra_proizvoda = req.body.sifra_proizvoda
    let tekst = req.body.tekst

    let faktura = await FakturaModel.findOne({korisnicko_ime_klijenta: korisnicko_ime,
        stavke:{$elemMatch:{sifraProizvoda:sifra_proizvoda,status:"primljeno"}}})

    if(!faktura){
        res.json(null)
        return
    }
    if(!tekst || tekst.trim()==""){
        res.json(null)
        return
    }

    let komentar= new KomentarModel({korisnicko_ime:korisnicko_ime,sifra_proizvoda:sifra_proizvoda,tekst:tekst.trim(),datum: new Date()})
    komentar= await komentar.save()
  res.json(komentar)
}

dodajSlike = (req: express.Request, res: express.Response) => {

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[]
  }

  if (!files || !files["glavna"] || files["glavna"].length == 0) {
    res.json(null)
    return
  }

  const glavnaSlika = files["glavna"][0].filename

  let dodatneSlike: string[] = []

  if (files["dodatne"]) {
    dodatneSlike = files["dodatne"].map(slika => slika.filename)
  }

  res.json({
    glavna_slika: glavnaSlika,
    dodatne_slike: dodatneSlike
  })
}    

sveKategorije= async(req: express.Request, res: express.Response) => {
    let kategorije= await KategorijeModel.find()
     res.json(kategorije);
     return
}    

stampareviProizvodi= async(req: express.Request, res: express.Response) => {
    let id_stampar=req.body.idStampar
    const proizvodi = await ProizvodModel.find({korisnicko_ime_vlasnika:id_stampar});
           res.json(proizvodi);
           return;  
} 

jedinstvenaSifra= async(req: express.Request, res: express.Response) => {
   let sifre:String[]=[]
   let proizvodi= await ProizvodModel.find()
   if(proizvodi){
    proizvodi.forEach(proizvod=>{
        sifre.push(proizvod.sifra)
    })
   }
   res.json(sifre)
   return
}

kreirajProizvod= async(req: express.Request, res: express.Response) => {
    let proizvod = new ProizvodModel(req.body)
    let postoji= await ProizvodModel.findOne({sifra:proizvod.sifra});
    if(postoji){
        res.json(null)
        return
    }
  proizvod= await proizvod.save()
    res.json(proizvod)
    return
}

promeniStanjeNaLageru= async(req: express.Request, res: express.Response) => {
    let sifraProizvod=req.body.sifra
    let kolicina=req.body.kolicina
    let proizvod= await ProizvodModel.findOne({sifra:sifraProizvod});
    if(proizvod){
        proizvod.kolicina_na_lageru=kolicina
       proizvod= await proizvod.save();
        res.json(proizvod);
           return;  
    }
    res.json(proizvod);
           return; 
}

 proizvodiTop5= async(req: express.Request, res: express.Response) => {
      const proizvodi = await ProizvodModel.find();
           if (proizvodi == null) {
           res.json(null);
           return;
         }
         let topProizvodi=new Array();
         let top5Proizvodi=new Array();
         proizvodi.forEach(proizvod=>{
             topProizvodi.push(proizvod)
           }
         );
        
         topProizvodi.sort((a, b) => b.broj_lajkova - a.broj_lajkova)
        let i=0
        topProizvodi.forEach(proizvod=>{
            if(i<5){
                top5Proizvodi.push(proizvod)
            }
            i++
        })

        res.json(top5Proizvodi);
     }

     sviProizvodi = async(req: express.Request, res: express.Response) => {
    const proizvodi = await ProizvodModel.find();
    if(proizvodi==null){
        res.json(proizvodi);
        return;
    }
    let dostupniProizvodi=Array();
    proizvodi.forEach(proizvod=>{
        if(proizvod.kolicina_na_lageru>0) dostupniProizvodi.push(proizvod)
    })
    res.json(dostupniProizvodi);
}

izabraniProizvod=async(req: express.Request, res: express.Response) => {
    let sifraP=req.body.sifra
    let rezultat= await ProizvodModel.findOne({ sifra: sifraP })
    res.json(rezultat)
}
  };





