import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    title: { type: String, required: true },
    age: { type: String, required: true },
    language: { type: String, required: true },
    cover_image: { type: String },
    lastLoggedinTime:
    {
        type: Number,
        required: true,
        default: function () {
            return new Date().getTime();
        }
    }
}, {
    timestamp: true
});

export default mongoose.model('courses', userSchema);