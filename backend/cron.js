require('dotenv');
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const cron = require('node-cron');
const User = require('./models/user');

const sendMailToAllUser = async (emailObj, name, medicineName, dosage) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    let mailGenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Medicine Reminder',
            link: 'https://github.com/codestarsingh?tab=repositories',
            copyright: '© 2023 Medicine Reminder. All rights reserved.'
        }
    });
    let response = {
        body: {
            name: name,
            intro: 'Take your required medicines',
            table: {
                data: [
                    {
                        medicine: medicineName,
                        dosage: dosage
                    }
                ]
            },
            outro: 'Have a nice day'
        }
    }
    let mail = mailGenerator.generate(response);
    const message = {
        from: process.env.USER,
        to: emailObj,
        subject: 'Here is the reminder for your medicines',
        html: mail
    }
    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail sent successfully: ', info.response);
        }
    });
}

const getString = (dayOfWeek) => {
    if (dayOfWeek == 0) return "S";
    if (dayOfWeek == 1) return "M";
    if (dayOfWeek == 2) return "T";
    if (dayOfWeek == 3) return "W";
    if (dayOfWeek == 4) return "Th";
    if (dayOfWeek == 5) return "F";
    return "Sa";
}

const sendMailAllUser = () => {
    try {
        cron.schedule('41 11 * * *', async function () {
            const date = new Date();
            const dayOfWeek = date.getDay();
            const searchString = getString(dayOfWeek);
            var usersData = await User.find({ "medicines.days": { $regex: searchString } });
            if (usersData.length > 0) {
                var emails = [];
                var name = [];
                var medicineName = [];
                var dosage = [];
                usersData.map((key) => {
                    emails.push(key.email);
                    name.push(key.name);
                    medicineName.push(key.medicines[0].medicineName);
                    dosage.push(key.medicines[0].dosage);
                });
                for(let i=0; i<emails.length; i++) {
                    sendMailToAllUser(emails[i], name[i], medicineName[i], dosage[i]);
                }
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    sendMailAllUser
}