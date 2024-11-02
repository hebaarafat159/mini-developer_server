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
    const subjectText = `${process.env.APP_NODE_EMAIL_MESSAGE_SUBJECT} ${registration.studentObj.first_name} ${registration.studentObj.last_name} ${(registration.courseObj) ? registration.courseObj.title : 'New Registration'}`
    const mailText = `
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_CHILD_TEXT} ${registration.studentObj.first_name} ${registration.studentObj.last_name} 
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_PARENT_TEXT} ${registration.parentObj.first_name} ${registration.parentObj.last_name} 
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_EMAIL_TEXT} ${registration.parentObj.email} 
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_MOBILE_TEXT} ${registration.parentObj.mobile} 
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_CHILD_AGE_TEXT} ${registration.studentObj.age}
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_HAS_COMPUTER_TEXT} ${(registration.studentObj.hasComputer) ? 'Yes' : 'No'} 
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_PROGRAM_TYPE_TEXT} ${registration.program_type}
        ${(registration.program_type && registration.program_type === 'In Person') ? `\n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_REGION_TEXT} ${registration.regionObj.name}` : ''}
        ${(registration.classroomObj && registration.classroomObj.place_id) ? `\n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_LOCATION_TEXT} ${registration.classroomObj.place_id.name}` : ''}
        ${(registration.leveObject) ? `\n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_LEVEL_TEXT} ${registration.leveObject.title}` : ''}
        \n ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_QUESTION_TEXT} ${registration.parentObj.questions}
        \n Consent Form: ${process.env.APP_NODE_EMAIL_MESSAGE_BODY_CONSENT_FORM_TEXT}${registration.studentObj.slug}`
    console.log(`Email text :   ${mailText}`)
    const mailOptions = {
        from: `"${registration.parentObj.first_name} ${registration.parentObj.last_name}" <${registration.parentObj.email}>`,
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
    const subjectText = `${process.env.APP_NODE_CONTACT_US_SUBJECT} ${(messageData.subject)}`
    const mailText = `${APP_NODE_CONTACT_US_MESSAGE_BODY_SENDER_NAME_TEXT} ${messageData.name} 
        \n ${APP_NODE_CONTACT_US_MESSAGE_BODY_SENDER_PHONE_TEXT} ${messageData.phone}
        \n ${APP_NODE_CONTACT_US_MESSAGE_BODY_SENDER_EMAIL_TEXT} ${messageData.email} 
        \n ${APP_NODE_CONTACT_US_MESSAGE_TEXT} ${messageData.message}`

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