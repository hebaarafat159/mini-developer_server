import 'dotenv/config'
import nodemailer from 'nodemailer'


export default {
    sendRegistrationEmail,
    sendMessageEmail
}

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

function sendRegistrationEmail(registration) {
    const subjectText = `[Test Mini Developer Registration] ${registration.studentObj.first_name} ${registration.studentObj.last_name} ${(registration.courseObj) ? registration.courseObj.title : 'New Registration'}`
    const mailText = ` Child Name: ${registration.studentObj.first_name} ${registration.studentObj.last_name} 
        \n Parent Name: ${registration.parentObj.first_name} ${registration.parentObj.last_name} 
        \n Email: ${registration.parentObj.email} 
        \n Mobile Number: ${registration.parentObj.mobile} 
        \n Child's Age: ${registration.studentObj.age}
        \n Has Computer: ${(registration.studentObj.hasComputer) ? 'Yes' : 'No'} 
        \n Programe Type: ${registration.program_type}
        ${(registration.program_type && registration.program_type === 'In Person') ? `\n Preffered Region: ${registration.regionObj.name}` : ''}
        ${(registration.classroomObj && registration.classroomObj.place_id) ? `\n Preffered Location: ${registration.classroomObj.place_id.name}` : ''}
        \n Questions: ${registration.parentObj.questions}`
    const mailOptions = {
        from: registration.parentObj.email,
        replyTo: registration.parentObj.email,
        to: process.env.APP_NODE_CLIENT_SIDE_TO_EMAIL_ADDRESS,
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

function sendMessageEmail(messageData) {
    const subjectText = `[Test Mini Developer] ${(messageData.subject)}`
    const mailText = `Name: ${messageData.name} 
        \n Phone: ${messageData.phone}
        \n Email: ${messageData.email} 
        \n Messager: ${messageData.message}`

    const mailOptions = {
        from: `"${messageData.name}" <${messageData.email}>`,
        replyTo: messageData.email,
        to: process.env.APP_NODE_CLIENT_SIDE_TO_EMAIL_ADDRESS,
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