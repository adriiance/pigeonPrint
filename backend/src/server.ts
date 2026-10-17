import express from "express";
import cors from "cors";
import mongoose from "mongoose";
 import userRouter from "./ruteri/korisniciRuter";
import proizvodRuter from "./ruteri/proizvodRuter";
import fakturaRuter from "./ruteri/fakturaRuter";
import path from "path";
import javnaNabavkaRuter from "./ruteri/javnaNabavkaRuter";
import dotenv from "dotenv";

dotenv.config();
// import productRouter from "./routers/product.router";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/pics", express.static(path.join(__dirname, "../pics")));

mongoose.connect("mongodb://127.0.0.1:27017/pigeonPrint");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = express.Router();
 router.use("/korisnici", userRouter);
router.use("/proizvodi", proizvodRuter);
router.use("/fakture", fakturaRuter);
router.use("/javneNabavke", javnaNabavkaRuter);

app.use("/", router);

app.listen(4000, () => console.log(`Express server running on port 4000`));
