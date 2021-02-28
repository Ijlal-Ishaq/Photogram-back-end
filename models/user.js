const mongoose= require('mongoose');
const Schema =mongoose.Schema;

const user = new Schema({
    
    username :{
        type:String,
        required:true
    },

    password :{
        type:String,
        required:true
    },

    avatar :{
        type:Number,
        required:true
    },

},{timestamps:true});

const User=mongoose.model('users',user);

module.exports=User;
