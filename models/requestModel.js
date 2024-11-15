import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({

    program_type: { type: String },
    parent_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'parents'
    },
    student_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'students'
    },
    region_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'regions'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'courses'
    },
    classroom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'classrooms'
    },
    other_region: { type: String, default: "" },
    title: { type: String, default: "" },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'courses'
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

export default mongoose.model('requests', userSchema);