const express =require('express');
const router = express.Router();

const AuthController=require("../controllers/auth_controller");


router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.post('/logout',AuthController.logout);
router.post('/check_login',AuthController.check_login);
router.post('/get_info',AuthController.get_info);
router.post('/change_profile',AuthController.change_profile);
router.post('/get_all_post',AuthController.get_all_posts);
router.post('/get_all_my_post',AuthController.get_all_my_posts);
router.post('/get_avatar',AuthController.get_avatar);




module.exports={
    router,
}