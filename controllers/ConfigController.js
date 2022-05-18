const Config = require('../models/Config');

const ConfigController = {

    getConfig: async (req, res, next) => {
        try {
            const config = await Config.find().select('-__v');
            if (config.length > 0) {
                return res.status(200).json({
                    count: config.length,
                    data: config,
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
            let params = [];
            params = req.body.params;
            if (params !== null && params.length > 0) {
                let config = await Config.find().select('-__v');
                if (config) {
                    params.map(async (item, index) => {
                        await Config.updateOne(
                            { _id: Object.keys(item)[0] },
                            { $set: { value: Boolean(Object.values(item)[0]) } }
                        )
                    });
                    return res.status(201).json({
                        message: `Update all config successfully`,
                        status: true
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
                    message: 'Please send params to update config !',
                    status: false,
                    statusCode: 1005
                })
            }
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = ConfigController;