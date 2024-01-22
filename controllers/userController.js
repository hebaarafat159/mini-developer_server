import 'dotenv/config'
import mongoose from "mongoose";
import User from '../models/userModel.js';


mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveUser,
    getUser
}

/**
 * form the request response in each cases success and error
 * @param {*} res 
 * @param {*} status // 200 for success , any error status
 * @param {*} body // requested data in case of success and "null" if the request failed
 * @param {*} message // error message or success message
 */
function retrunResponse(status, body, message){
    return {
        status: status,
        body: body,
        message: message
    };
}

async function saveUser(req,res){
    // const userObject = req.body;
    const userEmail = req.body.email;
    const userName = req.body.name;
    
    // console.log(`User Object: ${name} : ${email}` );
    try{
        if(await User.count({"email": userEmail}) === 0){
            // save new user
            const newUser = new User({
                name: userName,
                email: userEmail,
                lastLoginTime: new Date().getTime() 
            })
            const userObj = await newUser.save();
            res.send(retrunResponse(200, userObj, ""));
        }else{
            const lastLoggedInTime = new Date().getTime();
            console.log(`Updated lastLoggedin time : ${lastLoggedInTime}`);
        
            const userObj = await User.findOneAndUpdate({"email": userEmail},{
                name: userName,
                lastLoginTime: lastLoggedInTime
            })
            res.send(retrunResponse(200, userObj, ""));
        }
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getUser(req,res){
    try{
        const userEmail = req.body.email;
       // console.log(`User email = ${userEmail}`)
        const filter = {"email": `${userEmail}`};
        let userObject = null;
    
        userObject = await User.findOne(filter)
        // console.log(`User Object = ${JSON.stringify(userObject)}`)
        res.send(retrunResponse(200, userObject, ""));
    }catch (error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }  
}
