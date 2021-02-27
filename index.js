const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const Model = require('./models/apimodel')
const sha256 = require('js-sha256').sha256;
const path = require('path');
require('dotenv/config');



const PORT = process.env.PORT || 8080;
const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

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

app.get('/client',(req,res)=>{
    res.sendFile(path.join(__dirname+'/client.html'));
    console.log();
})

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
        let MongoUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
        await mongoose.connect(MongoUrl,{
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
