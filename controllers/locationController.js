import 'dotenv/config'
import mongoose from "mongoose";
import Place from '../models/placesModel.js';
import Region from '../models/regionModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveRegion,
    getRegions
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

async function saveRegion(req, res) {
    let region = await Region.findOne({ 'name': req.body.name });//getRegionByName(req.body.name);
    console.log(`saved Student Object: ${JSON.stringify(region)}`);
    try {
        // case of new region
        if (region === null) {
            // save new region
            const newRegion = new Region({
                name: req.body.name,
                has_upcomming_courses: req.body.has_upcomming_courses
            })
            const regionObj = await newRegion.save();
            res.send(retrunResponse(200, regionObj, ""));
        } else {
            res.send(retrunResponse(200, region, ""));
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getRegions(req, res) {
    try {
        const filter = {};
        let regions = await Region.find(filter);
        res.send(retrunResponse(200, regions, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}
