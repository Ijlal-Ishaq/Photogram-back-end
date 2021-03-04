const Post=require('../models/post');
const authcontroller=require('../controllers/auth_controller');
  
var admin = require("firebase-admin");

var serviceAccount = require("...");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "......."
});

var bucket = admin.storage().bucket();


const post=(req,res,next)=>{


    // console.log(req.file);
    let id,username=authcontroller.check_auth_by_token(req.body.token);

     
    if (!req.file) {
        res.send('Error');
    }
    
    let myfile=req.file.originalname.split('.');
    let newFileName = Date.now()+'.'+myfile[myfile.length-1];
  
    
    let fileUpload = bucket.file(newFileName);
  
    
    const blobStream = fileUpload.createWriteStream({
    
        metadata: {
    
            contentType: req.file.mimetype
    
        }
    
    });

    blobStream.on('error', (error) => {
      //  console.log(error);
      //  res.send('error');
    });
  
    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
       let url = "https://storage.googleapis.com/"+bucket.name+'/'+fileUpload.name;
       // resolve(url);

        if(id!="error"){
           

            let description=req.body.description;
            let postby=username;
           // url=req.file.filename;
            let likes=0;


            let post=Post({
                description,
                postby,
                url,
                likes
            });



            post.save()
            .then(post=>{

                    res.json({
                        result: post
                    })
                
                }
            )
            .catch(error=>{

                    res.json({
                        result: error
                    })
            
                }
            );
            
        }else{

            res.json({
                result: "error"
            })
        }
   
    });

    blobStream.end(req.file.buffer);


    
    


    

}

const delete_post= (req,res,next)=>{

     
    let id=req.body.post_id;
    let req_by= authcontroller.check_auth_by_token(req.body.token);
    
     

    Post.findById(id)
    .then(post=>{
        
         
         
        if(post.postby==req_by){

            Post.findByIdAndDelete(id)
            .then( post=>{
                res.send(post);
            }
            )
            .catch( err=>{
                res.send("Error");
            }
            );
            
        }else{
            res.send("Error...");
        }
   
    }).catch(error=>{
        res.send("Error...");
    });
    

}

const  like_post=(req,res,next)=>{
 
    let id=req.body.post_id;
    Post.findById(id)
    .then(post=>{
        post.likes=post.likes+1;
        post.save()
        .then(pos=>{
            res.json(pos);
        })
        .catch(error=>{
            res.send("Error...");
        })
    })
    .catch(error=>{
        res.send("Error...");
    })

}


module.exports={
    post,
    delete_post,
    like_post
}