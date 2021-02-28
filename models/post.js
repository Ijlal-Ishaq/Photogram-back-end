const { Int32 } = require('bson');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const post = new Schema({

    description:{
        type:String,
        required:true
    },

    postby:{
        type:String,
        required:true
    },

    url:{
        type:String,
        required:true
    } ,

    likes:{
        type:Number,
        required:true
    }



},{timestamps:true});

const Post = mongoose.model('post',post);

module.exports=Post