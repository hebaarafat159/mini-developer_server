import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    title: { type: String, required: true },
    age: { type: String, required: true },
    language: { type: String, required: true },
    cover_image: { type: String },
    course_duration: { type: Number }, // How long the course will be running.
    session_duration: { type: Number }, // How long each session is.
    price: { type: Number },
    type: { type: Array },// In-person or online
    prerequisite_courses: { type: Array }, // saved courses objectIds
    description: { type: String },
    course_subjects: { type: Array },
    course_skills: { type: Array },
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