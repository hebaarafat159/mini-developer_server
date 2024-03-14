import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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
    course_id: { type: String, default: "" },
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'courses'
    // },
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