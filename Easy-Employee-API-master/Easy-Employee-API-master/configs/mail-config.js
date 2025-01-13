const nodeMailer = require('nodemailer');
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = process.env.SMTP_PORT || 587; 
const smtpSecure = process.env.SMTP_SECURE ? JSON.parse(process.env.SMTP_SECURE) : true; // Convert 'true'/'false' string to boolean
const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS ? JSON.parse(process.env.SMTP_REQUIRE_TLS) : true;
const smtpAuthUser = process.env.SMTP_AUTH_USER || 'uccbibhu12321@gmail.com';
const smtpAuthPass = process.env.SMTP_AUTH_PASS || 'ryvoulcduolpoklp';

transpoter = nodeMailer.createTransport({
    host:smtpHost,
    port:smtpPort,
    secure:smtpSecure,
    requireTLS : smtpRequireTLS,
    auth:{
        user:smtpAuthUser,
        pass:smtpAuthPass
    }
})

module.exports = transpoter;