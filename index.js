const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const Model = require('./models/apimodel')
const sha256 = require('js-sha256').sha256;
require('dotenv/config');



const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "";

const app = express();

app.use(function (req, res, next) {
    console.log(`request from: ${req.host} ,to: ${req.url}` )
    next();
});
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    next();
});
app.use(bodyParser.json());
app.use('/api',router);

async function createRandomKey(){
    const model = new Model({
        ip:"Randomkey",
        key:sha256(Math.random().toString()),
    });
    try{
        const savedModel =await model.save();
    }catch (err){
        console.log(err)
    }
}

async function start(){
     try{
        await mongoose.connect(MONGO_URL,{
            useNewUrlParser:true,
            useFindAndModify:false
        })
         await createRandomKey();
         app.listen(PORT, ()=>{
             console.log(`Serve start at : localhost:${PORT} , with ${process.env.DELAY || 300}`)
         })
     }catch (e){
         console.log(e)
     }

}

start();
