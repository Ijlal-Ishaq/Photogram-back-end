const express =require('express');
const router = express.Router();
const PostController=require("../controllers/posts_controller");
const multer=require("multer");


// const storage =multer.diskStorage({
//     destination : function(req,file,cb){
//         cb(null,'./uploads/')
//     },
//     filename: function(req,file,cb){
//         cb(null,Date.now()+'.jpg')
//     }
// });
    
// const filefilter=(req,file,cb)=>{
//     console.log(file.mimetype);
//     if(file.mimetype=== 'image/jpeg' || file.mimetype=== 'image/png' || file.mimetype==='image/jpg'){
//         cb(null , true);
//     }else{
//         cb(null,false);
//     }
// };
    
const upload=multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize : 1024*1024*5
    },
    //fileFilter: filefilter
});



router.post('/post',upload.single('img'),PostController.post);
router.post('/deletepost',PostController.delete_post);
router.post('/likepost',PostController.like_post);


module.exports={
    router
}