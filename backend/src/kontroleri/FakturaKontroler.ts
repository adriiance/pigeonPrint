import * as express from "express";
import ProizvodModel from "../modeli/proizvod"
import FakturaModel from "../modeli/faktura"

export class FakturaKontroler {

 promeniStatusFakture=async(req: express.Request, res: express.Response) => {
  let idFak=req.body.id
  let noviStatus=req.body.noviStatus
  let faktura= await FakturaModel.findOne({id_fakture:idFak})
  if(faktura){
    if((faktura.status=="naruceno" && noviStatus=="u stampi")||(faktura.status=="u stampi" && noviStatus=="isporuceno")){
      faktura.status=noviStatus
      for(let i=0; i<faktura.stavke.length; i++){
        faktura.stavke[i].status=noviStatus
      }
      faktura= await faktura.save()
    }
    else{
      res.json(null)
          return;
    }
  }
        res.json(faktura)
          return;
 }

    dodajFakturu=async(req: express.Request, res: express.Response) => {
        let novaFaktura=req.body.novaFaktura
        let rezultat= await FakturaModel.insertOne(novaFaktura)
         res.json(rezultat)
    }

    mojeFakture= async (req: express.Request, res: express.Response) => {
        let korIme=req.body.korIme
        let fakture= await FakturaModel.find({korisnicko_ime_klijenta:korIme})
        res.json(fakture)
          return;
      }

     mojeFaktureStampar= async (req: express.Request, res: express.Response) => {
        let korIme=req.body.korIme
        let fakture= await FakturaModel.find({korisnicko_ime_stampara:korIme})
        res.json(fakture)
          return;
      }  

   otkaziFakturu= async (req: express.Request, res: express.Response) => {
    let id=req.body.id
    let faktura= await FakturaModel.findOneAndUpdate(
        {id_fakture:id, status:"naruceno"},
        {$set:{status:"otkazano"}},
        {new:true}
    )
    if(!faktura){
        res.json(null)
        return
    }
    for(let i=0; i<faktura.stavke.length; i++){
        faktura.stavke[i].status="otkazano"
    }
    faktura=await faktura.save()
    res.json(faktura)
}

promeniStatusProizvoda= async (req: express.Request, res: express.Response) => {
  let idFakture=req.body.id
  let idProizvoda=req.body.idProizvoda
  let faktura = await FakturaModel.findOne({id_fakture:idFakture})
  if(!faktura){
    res.json(null)
    return
  }
  let pronadjen=false
  for(let i=0; i<faktura.stavke.length; i++){
    if(faktura.stavke[i].sifraProizvoda==idProizvoda){
      faktura.stavke[i].status="primljeno"
      pronadjen=true
    }
  }
  if(!pronadjen){
     res.json(null)
    return
  }
  faktura=await faktura.save()
   res.json(faktura)
    return
}

  };





