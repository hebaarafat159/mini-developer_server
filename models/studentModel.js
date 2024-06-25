import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    has_computer: { type: Boolean, required: true, default: true },
    preffered_location: { type: String },
    program_type: { type: String },
    email: { type: String },
    mobile: { type: String },
    hear_about_us: { type: String },
    questions: { type: String },
    parent_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'parents'
    },
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

export default mongoose.model('students', userSchema);