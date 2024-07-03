import 'dotenv/config'
import mongoose from "mongoose";
import Parent from '../models/parentModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    addParent,
    saveParent,
    getParent,
    updateParent,
    getParents,
    getParentById
}

/**
 * form the request response in each cases success and error
 * @param {*} res 
 * @param {*} status // 200 for success , any error status
 * @param {*} body // requested data in case of success and "null" if the request failed
 * @param {*} message // error message or success message
 */
function retrunResponse(status, body, message) {
    return {
        status: status,
        body: body,
        message: message
    };
}

async function addParent(req) {
    const parentEmail = req.email
    let parentObj = null
    try {
        // case of new parent
        parentObj = await Parent.findOne({ "email": parentEmail })
        if (parentObj === null) {
            // save new parent
            const newParent = new Parent({
                first_name: req.first_name,
                last_name: req.last_name,
                email: req.email,
                mobile: req.mobile,
                hear_about_us: req.hear_about_us,
                questions: req.questions,
                lastLoginTime: new Date().getTime()
            })
            parentObj = await newParent.save();
        }
    } catch (error) {
        console.log("Error" + error);
        parentObj = null
    }
    return parentObj
}

async function saveParent(req, res) {
    try {
        // case of new parent
        const parentObj = await addParent(req);
        console.log(`Parent :  ${parentObj}`);
        res.send(retrunResponse(200, parentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function updateParent(req, res) {
    try {
        const parentObj = await Parent.findOneAndUpdate({ "email": req.params.email }, {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "mobile": req.body.mobile,
            "hear_about_us": req.body.hear_about_us,
            "questions": req.body.questions,
            "lastLoginTime": new Date().getTime()
        })
        await parentObj.save();
        res.send(retrunResponse(200, parentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParents(req, res) {
    try {
        const filter = {};
        let parents = await Parent.find(filter);//.populate("parent_cat");
        res.send(retrunResponse(200, parents, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParent(req, res) {
    try {
        let parentObject = await Parent.findOne({ "email": req.params.email })
        res.send(retrunResponse(200, parentObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParentById(parentId) {
    let parentObject = null
    try {
        parentObject = await Parent.findOne({ "_id": parentId })
        return parentObject;
    } catch (error) {
        console.log("Error" + error);
        parentObject = null
    }
}
