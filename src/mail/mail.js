const mailer = require('nodemailer');
const welcome = require('./welcome_template');
const goodbye = require('./goodbye_template');
const config = require('config');
const serverConfig = config.get('server');

require('dotenv').config();

const getEmailData = (to, name, template) => {
    let data = null;
    switch(template) {
        case "welcome":
            data = {
                from:'보내는 사람 <userId@gmail.com>',
                to,
                subject: `Hello, ${name}`,
                html: welcome()
            }
            break;
        case "goodbye":
            data = {
                from:'보내는 사람 <userId@gmail.com>',
                to,
                subject: `Goodbye, ${name}`,
                html: goodbye()
            }
            break;
        default:
            data;

    }

    return data;
}

const sendMail = (to, name, type) => {
   
    const transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SEND_EMAIL_ID,
            pass: process.env.SEND_EMAIL_PASSWORD
        }
    });

    const mail = getEmailData(to, name, type);
    console.log(to);
    console.log(name);
    console.log('mail'+ mail);
    transporter.sendMail(mail, (error, response) => {
        if(error) {
            console.log(error);
        }else{
            console.log('email send success'); 
        }

        transporter.close();
    });
}

module.exports = sendMail;

