import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: { type: String, required: true },
    slogan: { type: String, default: '' },
    age: { type: String, required: true },
    language: { type: String, required: true },
    cover_image: { type: String },
    link: { type: String },
    periority: { type: Number, default: 1 }, // periority to appear on order of courses
    course_duration: { type: Number }, // How long the course will be running.
    session_duration: { type: Number }, // How long each session is.
    price: { type: Number },
    type: { type: Array },// In-person or online
    seo_slug: { type: String, default: '' },
    seo_title: { type: String, default: '' },
    seo_description: { type: String, default: '' },
    prerequisite_courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses'
        }
    ], // saved courses objectIds
    description: { type: String },
    course_subjects: { type: Array },
    course_skills: { type: Array },
    levels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses'
        }
    ],
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

export default mongoose.model('courses', courseSchema);