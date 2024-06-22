import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    region_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'regions'
    },
});

export default mongoose.model('places', placeSchema);