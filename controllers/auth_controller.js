const User =require('../models/user'); 
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const Post = require('../models/post');
const { post } = require('request');


const register = (req,res,next)=>{
    
   

    User.findOne({username: req.body.username})
    .then(user=>{


        if(user){
         
            res.json({
                message :'username is taken'
            })
        
        }else{

            bcrypt.hash(req.body.password,10, function(err, hashedPass){

                if(err){
                    res.json({
                        message:'error'
                    })
                }
        
                let user= new User({
                    username: req.body.username,
                    password: hashedPass,
                    avatar: 1
                })
        
            
                user.save()
                .then(user =>{
                    res.json({
                        message: 'User Added'
                    })
                })
                .catch(error=>{
                    res.json({
                        message: 'User not Added'
                    })
                });
            
        
            })

        }


    })

    

}


const login = (req,res,next)=>{
    
    var username=req.body.username;
    var password=req.body.password;

    User.findOne({username: username})
    .then(user=>{

        if(user){
            
            bcrypt.compare(password,user.password, function(err,result){

                if(err){
                    res.json({
                        message: 'error'
                    })
                }
                if(result){

                    let token =jwt.sign({username:user.username,id:user.id},'avengers',{expiresIn:3*24*60*60});
                //    res.cookie('token',token,{httpOnly:true,maxAge: 3*24*60*60*1000});
                    res.json({
                        message:'Login Successful',
                        token:token
                    });
                }
                else{
                    res.json({
                        message: 'Incorrect Password'
                    })
                }
            })

        }else{
            res.json({
                message : 'user not found'
            })
        }

    });

}


const logout=(req,res,next)=>{

    res.json({
       
    });
    
    

     
}

const check_login=(req,res,next)=>{
    console.log(req.body);
    const token=req.body.token;

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                console.log(error);
                res.json({
                    message:'not login'
                });
            }else{
                res.json({
                    message:'login'
                });
            }


        });

    }else{
       
        
        res.json({
            message:'not login'
        });

    }

}

function check_auth_by_token(token){
    
    let id="error";
    let username="error";

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                
            }else{
                id=result.id;
                username=result.username;
                 
                 
            }


        });

    }else{

         

    }

    return id,username;

}

const check_auth=(req,res,next)=>{
  
    
    const token=req.body.token;
    

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                res.json({
                    message:'not login'
                });
            }else{
                req.body.id=result.id;
                next();
            }


        });

    }else{

        res.json({
                    message:'not login'
                });

    }


}


const get_info=(req,res,next)=>{

    const token=req.body.token;

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                res.json({
                    message:'NULL'
                });
            }else{

                
                User.findById(result.id)
                .then(
                    reslt=>{

                        res.json(reslt);
                    
                    }
                )
                .catch(
                    error=>{

                        res.json({
                            error: "error"
                        });

                    }
                )
                

                
            }


        });

    }else{

        res.json({
            message:'NULL'
        });

    }

}

const get_all_posts=(req,res,next)=>{

    const token=req.body.token;

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                res.json({
                    message:'NULL'
                });
            }else{

                
                User.findById(result.id)
                .then(
                    reslt=>{

                        Post.find({})
                        .then(result=>{

                            // console.log(result);

                            res.send(result);

                        })
                        .catch(error=>{

                            res.send('Error');

                        });
                        
                    
                    }
                )
                .catch(
                    error=>{

                        res.send('Error');

                    }
                )
                

                
            }


        });

    }
}

const get_all_my_posts=(req,res,next)=>{

    const token=req.body.token;

    if(token){

        jwt.verify(token,'avengers',(error,result)=>{

            if(error){
                res.json({
                    message:'NULL'
                });
            }else{

                
                User.findById(result.id)
                .then(
                    reslt=>{

                        Post.find({postby: reslt.username})
                        .then(result=>{

                            // console.log(result);

                            res.send(result);

                        })
                        .catch(error=>{

                            res.send('Error');

                        });
                        
                    
                    }
                )
                .catch(
                    error=>{

                        res.send('Error');

                    }
                )
                

                
            }


        });

    }
}

const change_profile=(req,res,next)=>{

    let id,username=check_auth_by_token(req.body.token);

    User.find({username:username})
    .then(user=>{
        user[0].avatar=req.body.avatar != "" && parseInt(req.body.avatar)<=5 && parseInt(req.body.avatar)>=1 ? req.body.avatar : 1;
        user[0].save()
        .then(user=>{
            res.json(user);
        })
        .catch(error=>{
            res.send("Error");
        });
    })
    .catch(error=>{
        res.send("Error");
    })

}

const get_avatar=(req,res)=>{

    let username=req.body.username;

    if(username){

    User.find({username:username})
    .then(result=>{
        // console.log(result[0].avatar);
        res.json({
            avatar : result[0].avatar
        });

    })
    .catch(error=>{
        // console.log(error);
        res.send('Error');
    });

    }else{
        
        res.send('Error');
    }


}

module.exports={
    register,
    login,
    logout,
    check_auth,
    check_login,
    get_info,
    check_auth_by_token,
    change_profile,
    get_all_posts,
    get_avatar,
    get_all_my_posts
}