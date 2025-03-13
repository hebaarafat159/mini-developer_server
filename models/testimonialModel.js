import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    text: { type: String, required: true },
    person: { type: String, required: true,default:"H.A." },
    parent_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parents'
    },
    student_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    },
    course_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    },
    date:
    {
        type: Date,
        default: function () {
            return new Date();
        }
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

export default mongoose.model('testimonials', userSchema);