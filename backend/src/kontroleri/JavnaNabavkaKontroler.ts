import * as express from "express";
import ProizvodModel from "../modeli/proizvod"
import FakturaModel from "../modeli/faktura"
import JavnaNabavkaModel from "../modeli/javnaNabavka"
import KorisnikModel from "../modeli/korisnik"
import nodemailer from "nodemailer";

interface Ponuda{
    korisnicko_ime_stampara:String,
     iznos:Number
    }

export class JavnaNabavkaKontroler {

    posaljiMejlStamparima=async(nabavka:any)=>{
    let stampari= await KorisnikModel.find({tip:"stampar"})
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    let listaProizvoda=""
    for(let i=0; i<nabavka.stavke.length; i++){
        listaProizvoda+=nabavka.stavke[i].nazivProizvoda+" - " +nabavka.stavke[i].kolicina+" kom.\n"
    }

    for(let i=0; i<stampari.length; i++){
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: stampari[i].mejl,
            subject: "PigeonPrint - Nova javna nabavka",
            text:
                "Otvorena je nova javna nabavka.\n\n"
                +"ID nabavke: " + nabavka.id_nabavke + "\n" 
                +"Institucija: " + nabavka.naziv_institucije + "\n\n" 
                +"Potrebni proizvodi:\n" +listaProizvoda +"\nLicitacija traje 10 minuta."
        })
    }
}

    kreirajNabavku=async(req: express.Request, res: express.Response) => {
        let novaNabavka=req.body.novaNabavka
        let rezultat= await JavnaNabavkaModel.insertOne(novaNabavka)
        if(!rezultat){
             res.json(null)
        }
        else{
            await this.posaljiMejlStamparima(novaNabavka)
             res.json(rezultat)
        }
    }

     mojeJavneNabavke=async(req: express.Request, res: express.Response) => {
        let id_klijenta=req.body.korisnickoIme
        let rezultat= await JavnaNabavkaModel.find({ korisnicko_ime_klijenta:id_klijenta})
        if(rezultat.length==0){
             res.json(rezultat)
             return
        }
        else{
            for(let i=0; i<rezultat.length; i++){
                await this.zavrsiPonudu(rezultat[i].id_nabavke)
            }
        rezultat= await JavnaNabavkaModel.find({ korisnicko_ime_klijenta:id_klijenta})
             res.json(rezultat)
        }

        
    }

    otvoreneJavneNabavke=async(req: express.Request, res: express.Response) => {
        let rezultat= await JavnaNabavkaModel.find({status:"otvorena"})
        if(rezultat.length>0){
            for(let i=0; i<rezultat.length; i++){
                await this.zavrsiPonudu(rezultat[i].id_nabavke)
            }
            rezultat= await JavnaNabavkaModel.find({status:"otvorena"})
        }
         res.json(rezultat)
    }

    prosloDesetMinuta(nastala:Date){
         let sad=Date.now() 
        let razlika=(sad-nastala.getTime())/1000
        let proslo=false
        if(razlika>=600) proslo=true
        return proslo
    }

imaDovoljno= async(korImeStampara:String, stavke:[{sifraProizvoda:String,nazivProizvoda:String,boja:String,tipStampe:String,kolicina:Number,jedinicnaCena:Number,dodatnaCenaStampe:Number,ukupnaCena:Number}])=>{
    let proizvodi= await ProizvodModel.find({korisnicko_ime_vlasnika:korImeStampara})
    let postoji=false
    if(proizvodi.length==0) return postoji
    let dovoljnaKolicina=true
    stavke.forEach(stavka=>{
        postoji=false
        proizvodi.forEach(proizvod=>{
            if(stavka.nazivProizvoda==proizvod.naziv){
                postoji=true
                if(proizvod.kolicina_na_lageru<stavka.kolicina){dovoljnaKolicina=false}
            }
        })
         if(!postoji){ dovoljnaKolicina=false}
    })
    return dovoljnaKolicina
}

zavrsiPonudu=async(nabavkaId:String)=>{
let nabavka= await JavnaNabavkaModel.findOne({id_nabavke:nabavkaId})
      if(!nabavka || nabavka.status!="otvorena"){
        return
    }
 let proslo10min=this.prosloDesetMinuta(nabavka.datum)
 if(!proslo10min) return   
 let pobednik= await this.nadjiPobednika(nabavkaId)
 if(pobednik==""){
    nabavka.status="nema pobednika"
 }
 else{
    nabavka.status="zavrsena"
    for(let i=0; i<nabavka.stavke.length; i++){
        nabavka.stavke[i].status="u stampi"
    }
    nabavka.pobednik=pobednik

    let proizvodi= await ProizvodModel.find({korisnicko_ime_vlasnika:pobednik})
    for(let i=0; i<nabavka.stavke.length; i++){
        for(let j=0; j<proizvodi.length;j++){
            if(proizvodi[j].naziv==nabavka.stavke[i].nazivProizvoda){
                proizvodi[j].kolicina_na_lageru-=nabavka.stavke[i].kolicina
                await proizvodi[j].save()
            }
        }
    }
    let pobednickiIznos=0
for(let i=0; i<nabavka.ponude.length; i++){
    if(nabavka.ponude[i].korisnicko_ime_stampara==pobednik){
        pobednickiIznos=nabavka.ponude[i].iznos
    }
    }
let stampar= await KorisnikModel.findOne({korisnicko_ime:pobednik})    
let faktura = new FakturaModel({id_fakture:Date.now()+"-"+pobednik,korisnicko_ime_klijenta:nabavka.korisnicko_ime_klijenta,korisnicko_ime_stampara:pobednik,naziv_stamparije:stampar.naziv_institucije,grad_stamparije:stampar.grad,status:"u stampi",ukupni_iznos:pobednickiIznos,datum:new Date(),stavke:nabavka.stavke})
await faktura.save()
 }
 nabavka= await nabavka.save()    
 return
}

nadjiPobednika=async(nabavkaId:String)=>{
    let nabavka= await JavnaNabavkaModel.findOne({id_nabavke:nabavkaId})
      if(!nabavka){
        return ""
    }
    let pobednik=""
    let minIznos=0
    for(let i=0; i<nabavka.ponude.length; i++){
        let imaDovoljno= await this.imaDovoljno(nabavka.ponude[i].korisnicko_ime_stampara, nabavka.stavke)
        if(imaDovoljno==true){
            if(pobednik==""){
                pobednik=nabavka.ponude[i].korisnicko_ime_stampara
                minIznos=nabavka.ponude[i].iznos
            }
            else{
                if(minIznos>nabavka.ponude[i].iznos){
                    pobednik=nabavka.ponude[i].korisnicko_ime_stampara
                minIznos=nabavka.ponude[i].iznos
                }
            }
        }
    }
    return pobednik
}


    dajPonudu=async(req: express.Request, res: express.Response) => {
        let id=req.body.id
        let  korIme=req.body.korIme
        let iznos=req.body.iznos
        if(iznos <= 0){
        res.json(null)
         return
        }

        let rezultat= await JavnaNabavkaModel.findOne({id_nabavke:id})
        if(!rezultat || rezultat.status!="otvorena"){
            res.json(null)
        return}
            if(this.prosloDesetMinuta(rezultat.datum)){
                await this.zavrsiPonudu(rezultat.id_nabavke)
                 res.json(null)
        return
            }
        let ponudaVecPostoji=false
       for(let i=0; i<rezultat.ponude.length; i++){
            if(rezultat.ponude[i].korisnicko_ime_stampara==korIme){
                 ponudaVecPostoji=true
            }
        }
        if(ponudaVecPostoji){
            res.json(null)
        return}  
        rezultat.ponude.push({korisnicko_ime_stampara:korIme, iznos:iznos})    
       rezultat= await rezultat.save()
       res.json(rezultat)
    }
  };





