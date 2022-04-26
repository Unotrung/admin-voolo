const mongoose = require('mongoose');

const otp_configSchema = new mongoose.Schema({

    config: {
        type: Boolean,
        required: [true, 'Config is required'],
    },
    // true là email, false là sms

}, { timestamps: true });

module.exports = mongoose.model('otpconfig', otp_configSchema);