const express = require('express');
const sha256 = require('js-sha256').sha256;
const router = express.Router();
const Model = require('../models/apimodel')
const delay = process.env.DELAY || 300; //sec
require('dotenv/config');


//Service funcs
async function UpdateModel(NewPocket,Newnonce,Ip){
    const update = await Model.updateOne(
        {'ip':Ip},
        {$set:{
                pocket:NewPocket,
                last_date:Date.now(),
                nonce : Newnonce
            }}
    )
}

//Faucet
router.post('/faucet',async (req,res)=>{
    try {
        const query = await Model.findOne({'ip':req.body.ip});
        if(sha256(query.key+query.nonce) === req.body.key){
            let TimeDelta = (Date.now() - query.last_date.getTime())/1000;
            let NewPocket = query.pocket - 0.05;
            let Newnonce = query.nonce + 1;
            if (TimeDelta < delay){
                await UpdateModel(NewPocket,Newnonce,req.body.ip);
                res.status(200).json({'message':'ok'});
            }else if(TimeDelta > delay) {
                NewPocket +=1;
                await UpdateModel(NewPocket,Newnonce,req.body.ip);
                res.status(200).json({'message':'ok'});
            }
        }else {
            res.status(403).json({'message':'incorrect key'});
        }

    }catch (err) {
        console.log(err);
        res.status(500).json({'message':'server error'});
    }
})


//Info
router.post('/info',async (req,res)=>{
    try {
        const query = await Model.findOne({'ip':req.body.ip});
        const Randomkey = await Model.findOne({'ip':'Randomkey'});
        if(query.key === req.body.key){
            res.status(200).json({'pocket':query.pocket,'RandomKey':Randomkey.key})
        }else {
            res.status(403).json({'message':'incorrect key'});
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({'message':'server error'});
    }
})


//Register
router.post('/register',async (req,res)=>{
    const model = new Model({
        ip:req.body.ip,
        key:req.body.key,
        pocket:1.0,
    });
    try{
        const savedModel =await model.save();
        res.status(201).json(savedModel);
    }catch (err){
        console.log(err)
        res.json({"error":err})
    }
})

//Submit task
router.post('/submit',async (req,res)=>{
    try {
        const Randomkey = await Model.findOne({'ip':'Randomkey'});
        const query = await Model.findOne({'ip':req.body.ip});
        if(query.key === req.body.key){
            if (sha256(Randomkey.key + req.body.salt).substr(-4, 4) === 'd730' ){
                let NewPocket = query.pocket - 1.0;
                NewPocket = NewPocket + 2.0;
                let Newnonce = query.nonce;
                await UpdateModel(NewPocket,Newnonce,req.body.ip);
                const update = await Model.updateOne(
                    {'ip':'Randomkey'},
                    {$set:{
                            key:sha256(Math.random().toString())
                        }}
                );
                res.status(200).json({'message':'salt get'});
            }else{
                res.status(400).json({"message":"salt is incorrect"});
            }
        }else {
            res.status(400).json({'message':'incorrect key'});
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({'message':'server error'});
    }
})

module.exports = router;