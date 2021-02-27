const mongoose = require('mongoose');


const APISchema = mongoose.Schema({
    ip:{
        type:String,
        required:true,
        unique:true
    },
    key:{
        type:String,
        required:true,

    },
    pocket:{
        type:mongoose.Schema.Types.Decimal128,
        required:false,
    },
    last_date:{
        type:Date,
        default:Date.now()
    },
    nonce :{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('Api',APISchema);