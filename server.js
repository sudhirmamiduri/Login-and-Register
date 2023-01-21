 const express = require('express');
 const mongoose = require('mongoose');
 const Registeruser = require('./model');
 const jwt = require('jsonwebtoken');
 const middleware = require('./middleware');
 const cors = require('cors');
 const app = express();

mongoose.connect('mongodb+srv://sudhirmamiduri:Yesayyah@db.6thwpd2.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('DB Connected')
)

app.use(express.json());

app.use(cors({origin:"*"}))

app.post('/register', async (req,res)=>{
    try{
        const{username,email,password,confirmpassword} = req.body;
        let exist = await Registeruser.findOne({email:email})
        if(exist){
            return res.status(400).send('User Already Exist')
        }
        if(password !== confirmpassword){
            return res.status(400).send('Passwords are not Matching')
        }
        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internal Server Error')
    }
})

app.get('/gettask',async(req,res) => {
    try{
        return res.json(await Registeruser.find());
    }
    catch(err){
        console.log(err);
    }
})

app.post('/login', async(req,res) =>{
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Incorrect Password'); 
        }
        let payload = {
            user : {
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000000},
            (err,token) =>{
                if (err) throw err;
                return res.json({token})
            }
            )
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

app.get('/myprofile', middleware,async(req,res)=>{
    try{
        let exist = await Registeruser.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User Not Found');
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

 app.listen(9800,()=>{
    console.log('Server is Running!!!')
 })