const { Users } = require('../models/Users');

const checkPermissions = async(req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await Users.findById(userId);
        const deleteUserId = await Users.findById(req.body.deleteUserId);

        // testing
        if(userId===req.body.deleteUserId){
            return res.status(400).send({error:"You cannot delete yourself"});
        }
        else if(!user){
            return res.status(401).send({ error: "Please authenticate using valid token" })
        }
        else if(!deleteUserId){
            return res.status(401).send({ error: "User required do not exists" })
        }
        

        if(user.role < deleteUserId.role){
            next();
        }else{
            return res.status(401).send({ error: "You are not authorized to delete this user" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = checkPermissions;