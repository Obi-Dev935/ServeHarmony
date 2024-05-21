const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendOTP(phoneNumber, message) {
    return client.messages.create({
        body: message,
        to: phoneNumber,  // Text this number
        from: process.env.TWILIO_PHONE_NUMBER // From a valid Twilio number
    });
}
module.exports = { sendOTP };