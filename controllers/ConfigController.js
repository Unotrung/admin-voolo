const OtpConfig = require('../models/Otp_Config');

const OtpConfigController = {

    getOtpConfig: async (req, res, next) => {
        try {
            const otpConfig = await OtpConfig.findOne();
            const { __v, config, ...others } = otpConfig._doc;
            if (otpConfig) {
                if (config === true) {
                    return res.status(200).json({
                        data: { ...others },
                        name: "Email",
                        value: config,
                        message: "Get otpConfig successfully",
                        status: true
                    })
                }
                else {
                    return res.status(200).json({
                        data: { ...others },
                        name: "Sms",
                        value: config,
                        message: "Get otpConfig successfully",
                        status: true
                    })
                }
            }
            else {
                return res.status(404).json({
                    message: "Otp Config is not init",
                    status: false
                })
            }
        }
        catch (err) {
            next(err)
        }
    },

    putOtpConfig: async (req, res, next) => {
        try {
            const config = Boolean(req.body.otp_config);
            if (config !== null && config !== '') {
                const otpConfig = await OtpConfig.findOne();
                console.log("OTP CONFIG: ", otpConfig);
                if (otpConfig) {
                    await otpConfig.updateOne({ $set: { config: config } })
                        .then((data) => {
                            if (config === true) {
                                return res.status(201).json({
                                    message: "Change otp config from sms to email successfully",
                                    status: true
                                })
                            }
                            else if (config === false) {
                                return res.status(201).json({
                                    message: "Change otp config from email to sms successfully",
                                    status: true
                                })
                            }
                        })
                        .catch((err) => {
                            return res.status(201).json({
                                message: "Change otp config failure",
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(404).json({
                        message: 'Can not find otp config to update',
                        status: false,
                        statusCode: 900
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: 'Please choose your config !',
                    status: false
                })
            }
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = OtpConfigController;