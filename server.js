const express= require("express");
const app =express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const auth_route=require("./routes/auth");  
const posts_route=require("./routes/posts");
const auth_controller=require("./controllers/auth_controller");


const port=process.env.PORT || 3000;
  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('uploads'));

 
const dbURI ='mongodb...'; 
mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology: true})
.then((result)=>{
    app.listen(port,()=>{console.log(port)}); 
})
.catch((error)=>{
    // console.log(error);
});
 
app.get('/',(req,res)=>{

    res.send('server live!');

});

app.use("/auth",auth_route.router);
app.use("/post",posts_route.router);
