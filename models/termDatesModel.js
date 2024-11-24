import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    year: { type: String, required: true },
    is_current_term: { type: Boolean, default: false },
    sections: { type: Array }
});

export default mongoose.model('termdates', userSchema);