const Config = require('../models/Config');
const { MSG_GET_LIST_SUCCESSFULLY, MSG_LIST_IS_EMPTY, MSG_UPDATE_SUCCESSFULLY, MSG_UPDATE_FAILURE, MSG_ENTER_ALL_FIELDS, MSG_DATA_NOT_FOUND }
    = require('../config/message/message');

const ConfigController = {

    getConfig: async (req, res, next) => {
        try {
            const config = await Config.find().select('-__v');
            if (config.length > 0) {
                return res.status(200).json({
                    count: config.length,
                    data: config,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: config.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
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
                        message: MSG_UPDATE_SUCCESSFULLY,
                        status: true
                    })
                }
                else {
                    return res.status(404).json({
                        message: MSG_DATA_NOT_FOUND,
                        status: false,
                        statusCode: 900
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: MSG_ENTER_ALL_FIELDS,
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