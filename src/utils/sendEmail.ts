import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: 'sandboxa9e665c1099b4e05b75ec9f25e527c74.mailgun.org'
});


const sendEmail = (subject: string, html: string) => {
    const emailData = {
        from: "xognstltl@naver.com",
        to: "xognstltl@naver.com",
        subject,
        html
    }; return mailGunClient.messages().send(emailData);;
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello~ ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://number.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject, emailBody);
};
