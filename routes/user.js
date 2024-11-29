
const { Users } = require('../models/Users');
const bcrypt = require('bcryptjs');

const express = require('express');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const checkPermissions = require('../middleware/checkPermissions');
const router = express.Router();

const JWT_SECRET = "I am Anup";

router.get('/getAll',fetchUser, async (req, res) => {
    const users = await Users.find().select("-password");
    res.status(200).json(users)
});

router.post('/new', async (req, res) => {
    try {
        if (
            !req.body.name ||
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Send all required fields: name,email,password',
            });
        }


        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);



        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
            date: req.body.date
        };


        const user = await Users.create(newUser);
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);




        return res.status(201).json({
            success: true,
            authToken
        });
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
});

//Authenticate User for login
router.post('/auth', async(req, res) => {
    try {
        if (
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Send all required fields: email,password',
            });
        }

        const { email, password } = req.body;
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Try Logging with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try Logging with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        return res.status(201).json({
            success: true,
            authToken
        });

    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
})

//Getuser details with token provided. Login required
router.get('/getUser',fetchUser,async(req,res)=>{

    try {
        const userId = req.user.id;
        const user = await Users.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);  // Fix the typo here
        return res.status(500).send("Internal Server Error");
    }
})

//Autheticate the request, Authorize the user access level, and delete if respective user is present
router.delete('/delete',fetchUser,checkPermissions,async(req,res)=>{
    try {
        
  
        
        const user = await Users.findByIdAndDelete(req.body.deleteUserId);
        if(!user){
            return res.status(400).send("User not found");
        }
        console.log("User Deleted");
        res.status(200).send(user);
    } catch (error) {
        console.log(error.message);  
        return res.status(500).send("Internal Server Error");
    }
})


//change role : user->moderator or moderator ->user, only admin can change role

router.put('/changeRole',fetchUser,async(req,res)=>{
    try {
        

        const userId = req.user.id;
        const user = await Users.findById(userId);
        const userToChange = await Users.findById(req.body.userId);

        //edgecases
        if(!userToChange){
            return res.status(400).send("Required user not found");
        }
        else if(userToChange.role===1){
            return res.status(400).send("Cannot change role of Admin");
        }
        else if(userToChange.role===req.body.newRole){
            return res.status(400).send("Role already set");
        }else if(req.body.newRole===1){
            return res.status(400).send("Cannot change role to Admin");
        }

        if(user.role===1){
            const user = await Users.findByIdAndUpdate(req.body.userId,{role:req.body.newRole},{new:true});
            return res.status(200).send(user);
        }else{
            return res.status(401).send("You are not authorized to change role");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;