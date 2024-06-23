import 'dotenv/config'
import mongoose from "mongoose";
import Place from '../models/placesModel.js';
import Region from '../models/regionModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveRegion,
    getRegions,
    getActiveRegions,
    savePalce,
    getAllPlaces,
    getRegionPalces,
    getPlaceById
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
    try {
        let region = await Region.findOne({ 'name': req.body.name });//getRegionByName(req.body.name);
        console.log(`saved Student Object: ${JSON.stringify(region)}`);

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

async function getActiveRegions(req, res) {
    try {
        let regions = await Region.find({ 'is_active': true });
        res.send(retrunResponse(200, regions, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getRegionPalces(req, res) {
    try {
        let palces = await Region.find({ 'is_active': true, 'region_id': req.params.regionId });
        res.send(retrunResponse(200, palces, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getAllPlaces(req, res) {
    try {
        let palces = await Place.find({});
        res.send(retrunResponse(200, palces, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}


async function savePalce(req, res) {
    try {
        let palce = await Place.findOne({ 'name': req.body.name });//getRegionByName(req.body.name);
        console.log(`saved Region Place: ${JSON.stringify(palce)}`);

        // case of new place
        if (palce === null) {
            let region = await Region.findOne({ '_id': req.body.region_id });
            console.log(`Region: ${JSON.stringify(region)}`);

            // save new place
            const newPlace = new Place({
                name: req.body.name,
                address: req.body.address,
                is_active: req.body.is_active,
                region_id: region._id
            })
            const placeObj = await newPlace.save();
            res.send(retrunResponse(200, placeObj, ""));
        } else {
            res.send(retrunResponse(200, palce, ""));
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getPlaceById(placeId) {
    try {
        let placeObject = await Place.findOne({ '_id': placeId })
        return placeObject
    } catch (error) {
        console.log("Error" + error);
        return null
    }
}


