import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const regionSchema = new Schema({
    name: { type: String, required: true },
    has_upcomming_courses: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true }
});

export default mongoose.model('regions', regionSchema);