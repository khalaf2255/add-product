import express from "express"
import bootstrap from "./src/index.router.js"
import dotevn from "dotenv";
 dotevn.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirFileName = fileURLToPath(import.meta.url);
const app = express()
 
bootstrap(app, express) 
app.use("/uploads", express.static(`./src/uploads`))


app.listen(process.env.PORT, (req, res, next) => {
    console.log(`Your server is running on port.....${process.env.PORT}`);
}) 