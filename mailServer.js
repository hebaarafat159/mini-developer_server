import 'dotenv/config'
import nodemailer from 'nodemailer'


export default {
    sendRegistrationEmail,
}


const fromEmailAddress = "mini.developer.server@gmail.com"
const toEmailAddress = "mini.developer.info@gmail.com"


const transporter = nodemailer.createTransport({
    service: process.env.APP_NODE_MAILER_SERVICE,
    host: process.env.APP_NODE_MAILER_HOST,
    port: process.env.APP_NODE_MAILER_PORT,
    secure: process.env.APP_NODE_MAILER_SRCURE,
    auth: {
        user: process.env.APP_NODE_MAILER_AUTH_USER,
        pass: process.env.APP_NODE_MAILER_AUTH_PASSWORD,
    },
});


function sendRegistrationEmail(course, parent, student) {
    const subjectText = `[Test Mini Developer Registration] ${(course) ? course.title : 'New Registration'}`
    const mailText = ` Child Name: ${student.first_name} ${student.first_name} 
        \n Parent Name: ${parent.first_name} ${parent.last_name} 
        \n Email: ${parent.email} 
        \n Mobile Number: ${parent.mobile} 
        \n Child's Age: ${student.age}
        \n Has Computer: ${(student.hasComputer) ? 'Yes' : 'No'}
        \n Questions: ${parent.questions}`
    const mailOptions = {
        from: fromEmailAddress,
        to: toEmailAddress,
        subject: subjectText,
        text: mailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}