const Config = require('../models/Config');

const ConfigController = {

    getConfig: async (req, res, next) => {
        try {
            const config = await Config.find().select('-__v');
            if (config.length > 0) {
                return res.status(200).json({
                    count: config.length,
                    data: result,
                    message: "Get list config success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: config.length,
                    data: null,
                    message: "List config is empty ",
                    status: true
                })
            }
        }
        catch (err) {
            next(err)
        }
    },

    putConfig: async (req, res, next) => {
        try {
            const id = req.body.id;
            const value = Boolean(req.body.value);
            if (id !== null && id !== '' && value !== null && value !== '') {
                const config = await Config.findById(id);
                if (config) {
                    await config.updateOne({ $set: { value: value } })
                        .then((data) => {
                            return res.status(201).json({
                                message: `Update ${config.name} Successfully. ${config.name} is ${value ? 'open' : 'close'}`,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: `Update ${config.name} Failure. ${config.name} is ${config.value ? 'open' : 'close'}`,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(404).json({
                        message: 'Can not find config to update',
                        status: false,
                        statusCode: 900
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: 'Please enter your id and choose your config !',
                    status: false
                })
            }
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = ConfigController;