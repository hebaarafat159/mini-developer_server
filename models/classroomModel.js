import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    title: { type: String, default: "" },
    start_date: { type: String, default: "" },
    end_date: { type: String, default: "" },
    start_time: { type: String, default: "" },
    end_time: { type: String, default: "" },
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
    region_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'regions'
    },
    place_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'places'
    }
});

export default mongoose.model('classrooms', userSchema);