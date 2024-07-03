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
        default: "",
        ref: 'regions'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: "",
        ref: 'courses'
    },
    classroom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: "",
        ref: 'classrooms'
    },
    title: { type: String, default: "" },
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