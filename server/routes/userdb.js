let express = require('express');
const multer = require('multer');

let {registerUser,loginUser,updatePassword,autoLoginUser,updateUser,changePassword,findUser,uploadImage,deleteUser,googleLogin,dauthLogin} = require('../controllers/auth.js');

let dbRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


dbRoutes.post('/register',registerUser);
dbRoutes.post('/login',loginUser);
dbRoutes.get('/verify',autoLoginUser);
dbRoutes.get('/find',findUser);
dbRoutes.put('/update',updateUser);
dbRoutes.put('/changePassword',changePassword);
dbRoutes.put('/updatePassword',updatePassword);
dbRoutes.post('/uploadImage', upload.single('image'),uploadImage)
dbRoutes.delete('/delete',deleteUser);
dbRoutes.get('/google/callback', googleLogin)
dbRoutes.get('/dauth/callback', dauthLogin)

module.exports=dbRoutes;