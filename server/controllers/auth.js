const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
require('dotenv').config();
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

let userModel = require('../models/user.js')

function generateToken(userId){
  let payload ={userId:userId};
  let options = {
    expiresIn : '60m'
  }
  return jwt.sign(payload,process.env.SECRET_KEY,options);
}

//based on roles
let findUser = async (req, res) => {
  let {id} = req.query;
  try {
    let users;
    if(req.query.role==='all'){
    users = await userModel.find({});
    } else if(id){
      users = await userModel.findOne({_id:id}).populate({
  path: 'myTransactions'
})
      console.log(users)
    }else{
    users = await userModel.find({ role: req.query.role });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    res.status(500).json({ message : error.message });
  }
};


let loginUser = async (req,res)=>{

let user ={
  email : req.body.email,
  password : req.body.password,
  role:req.body.role
}

try{
  let findRes = await userModel.findOne({email : user.email,role:user.role});

 if(!findRes){
    return res.status(404).json({ message : "User not found" });}

  const isSamePassword = await bcrypt.compare(user.password,findRes.password);
  if(isSamePassword){
  let token = generateToken(findRes._id);
  res.status(200).json({message:"login successful",token,user:findRes});
  } else{
    res.status(401).json({message:"Incorrect Password"});
  }

  }
  catch(error){
   console.error(`Error finding user: ${error.message}`);
   res.status(500).json({ message : error.message });
}}

let registerUser = async (req, res) => {

  const { role,username, email, password } = req.body;

  try {
    const userInfo = await userModel.findOne({ email });
    if (userInfo) {
      return res.status(201).json({message : "Email already registered"});
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const user = new userModel({
      role,
      username,
      email,
      password : hashedPassword,
      isVerified: false,
      amountAvailable: 200,
    });

    const registerRes = await user.save();
    console.log("User registered:", registerRes);

    let token = generateToken(registerRes._id)

    res.status(201).json({message : "Registration Successful",token,user:registerRes});
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const autoLoginUser = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const userInfo = await userModel.find({_id:decoded.userId});

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userInfo);

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

let updateUser = async (req,res)=>{
  let {id,email} = req.query

  console.log(id,req.body.updateFields)

  try{
    let updateRes
    if(id){
  updateRes = await userModel.findOneAndUpdate({_id:id},{$set:req.body.updateFields},{ new: true});
    } else{
    updateRes = await userModel.findOneAndUpdate({email:email},{$set:req.body.updateFields},{ new: true});
    }

    console.log(updateUser)

  if(!updateRes){
    return res.status(404).json({message:'not found'});
  }
  res.status(200).json({message:'updated Successfully',user:updateRes})
  } catch(err){
    console.log(err)
    res.status(201).json(err)
  }
}

const changePassword = async (req, res) => {
  const {userId} = req.query;
  const { currentPassword,newPassword } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      console.log('user not found')
      return res.status(404).json({ message: "User not found" });
    }
     console.log('user found')
    const isSamePassword = await bcrypt.compare(currentPassword, user.password);

    if (isSamePassword) {
      console.log('password correct')
    const isSame = await bcrypt.compare(newPassword, user.password);
    if(isSame){
      console.log('password same enter new')
      return res.status(400).json({ message: "New password must be different" });
    } else{
         console.log('success')
     const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const updateRes = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { password : newHashedPassword }} ,{new:true}
    );
    
    return res.status(200).json({ message: "Password updated successfully",user:updateRes});

    }} else{return res.status(404).json({ message: "Enter Correct Password" });}
  
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const {email} = req.query;
  const { password } = req.body;

  console.log(email)

  try {
    const user = await userModel.findOne({email:email});

    if (!user) {
      console.log('user not found')
      return res.status(404).json({ message: "User not found" });
    }
     console.log('user found')
    const isSamePassword = await bcrypt.compare(password, user.password);

    if(isSamePassword){
      console.log('password same enter new')
      return res.status(400).json({ message: "New password must be different" });
    } else{
         console.log('success')
     const newHashedPassword = await bcrypt.hash(password, 10);
    const updateRes = await userModel.findByIdAndUpdate(
      { _id : user._id },
      { $set: { password : newHashedPassword }} ,{new:true}
    );
    console.log(updateRes)
    return res.status(200).json({ message: "Password updated successfully",user:updateRes});
    }

  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};



const uploadImage = async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
  });

  try {
    if (!req.file) return res.status(400).json({ error: 'No file sent' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image',
      folder: 'your_folder',
    });

    await userModel.updateOne(
      { _id: req.user.id }, 
      { $set: { profileImageUrl: result.secure_url } }
    );

  
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Uploaded!', url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

const deleteUser = async (req,res)=>{
try{
let result = await userModel.deleteOne({_id:req.query.id});
if(!result){
 return res.status(400).json('user not found') 
}
res.status(200).json('successfully deleted user')
} catch(err){
res.status(401).json(err)
}  
}

const googleLogin = async (req, res) => {

  const code = req.query.code;

  if (!code) return res.status(400).send('No code found');

  try {
   
const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
  params: {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret:process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.server_url}/auth/google/callback`,
    grant_type: 'authorization_code'
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});



    const { access_token} = data;


    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });



    console.log('User Info:', userInfo.data);

     let user;

    user = await userModel.findOne({email:userInfo.data.email});

    if (!user) {
      user={role:'client',email:userInfo.data.email,username:userInfo.data.name,isVerified:userInfo.data.email_verified,amountAvailable: 200}

      user = await userModel.insertOne(user);
    }

    console.log(user)

    let token = generateToken(user._id);
    console.log(token)
    res.redirect(`${process.env.client_url}/login?token=${token}`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('OAuth Error');
}}

const dauthLogin = async (req, res) => {

  const code = req.query.code;


  if (!code) return res.status(400).send('No code found');

  console.log(code)

  try {

const body = new URLSearchParams();
body.append('code', code);
body.append('client_id', 'lAOrfPy9uph9nGYe');
body.append('client_secret', '2jWHatDxdaXHKx8qyyPEfrxJoesbbeaB');
body.append('redirect_uri', 'http://localhost:5000/auth/dauth/callback');
body.append('grant_type', 'authorization_code');

const { data } = await axios.post('https://auth.delta.nitt.edu/api/oauth/token', body.toString(), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});


console.log(data)

    const { access_token} = data;

const userInfo = await axios.post(
  'https://auth.delta.nitt.edu/api/resources/user',
  {},
  {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }
);


    console.log('User Info:', userInfo.data);

     let user;

    user = await userModel.findOne({email:userInfo.data.email});

    if (!user) {
      user={role:'client',email:userInfo.data.email,username:userInfo.data.name,isVerified:userInfo.data.email_verified,amountAvailable: 200}

      user = await userModel.insertOne(user);
    }

    console.log(user)

    let token = generateToken(user._id);
    console.log(token)
    res.redirect(`${process.env.client_url}/login?token=${token}`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('dauth Error');
}}


module.exports = {registerUser,loginUser,autoLoginUser,updatePassword,changePassword,updateUser,findUser,uploadImage,deleteUser,googleLogin,dauthLogin};