const User_Provider = require('../models/User_Provider');
const Bnpl_Personal = require('../models/Bnpl_Personal');
const Bnpl_Customer = require('../models/Bnpl_Customer');
const Eap_Customer = require('../models/EAP_Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MSG_GET_LIST_SUCCESSFULLY, MSG_LIST_IS_EMPTY, MSG_UPDATE_SUCCESSFULLY, MSG_UPDATE_FAILURE, MSG_ENTER_ALL_FIELDS,
    MSG_DATA_NOT_FOUND, MSG_GET_DETAIL_SUCCESS, MSG_GET_DETAIL_FAILURE, MSG_ADD_SUCCESS, MSG_ADD_FAIL, MSG_WRONG_NAME, MSG_WRONG_PASSWORD,
    MSG_LOGIN_SUCCESS, MSG_LOGIN_FAIL, MSG_LOG_OUT_SUCCESS, MSG_LOG_OUT_FAIL, MSG_RESTORE_SUCCESS, MSG_RESTORE_FAIL, MSG_DELETE_SUCCESS, MSG_DELETE_FAIL }
    = require('../config/message/message');

const UserController = {

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: '30m' }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: '3h' }
        );
    },

    getAllUserProvider: async (req, res, next) => {
        try {
            const users = await User_Provider.find();
            let result = [];
            users.map((user, index) => {
                let { password, isAdmin, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllEAP: async (req, res, next) => {
        try {
            const users = await Eap_Customer.find();
            let result = [];
            users.map((user, index) => {
                let { password, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllBNPLCustomer: async (req, res, next) => {
        try {
            const users = await Bnpl_Customer.find();
            let result = [];
            users.map((user, index) => {
                let { pin, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllBNPLPersonal: async (req, res, next) => {
        try {
            const users = await Bnpl_Personal.find();
            let result = [];
            users.map((user, index) => {
                let { providers, items, tenor, credit_limit, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getUserEAP: async (req, res, next) => {
        try {
            const user = await Eap_Customer.findById(req.params.id);
            if (user) {
                const { password, __v, ...others } = user._doc;
                return res.status(200).json({
                    message: MSG_GET_DETAIL_SUCCESS,
                    data: { ...others },
                    status: true
                });
            }
            else {
                return res.status(404).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

    getUserBNPL: async (req, res, next) => {
        try {
            const user = await Bnpl_Personal.findById(req.params.id).populate('providers');
            if (user) {
                const { items, tenor, __v, ...others } = user._doc;
                return res.status(200).json({
                    message: MSG_GET_DETAIL_SUCCESS,
                    data: { ...others },
                    status: true
                });
            }
            else {
                return res.status(404).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

    register: async (req, res, next) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            let isAdmin = req.body.isAdmin;
            if (username !== "" && username !== null && password !== "" && password !== null && isAdmin !== true && isAdmin !== false) {
                const users = await User_Provider.find();
                const user = users.find(x => x.username.toLowerCase() === username.toLowerCase());
                if (!user) {
                    const salt = await bcrypt.genSalt(10);
                    const hashed = await bcrypt.hash(password, salt);
                    const user = await new User_Provider({ username: username, password: hashed });
                    await user.save()
                        .then((data) => {
                            return res.status(201).json({
                                message: MSG_ADD_SUCCESS,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_ADD_FAIL,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(409).json({
                        message: "User is already exists",
                        status: false,
                        statusCode: 1000
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
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            if (username !== "" && username !== null && password !== "" && password !== null) {
                const users = await User_Provider.find();
                const user = users.find(x => x.username.toLowerCase() === username.toLowerCase());
                if (!user) {
                    return res.status(404).json({ message: MSG_WRONG_NAME, status: false, statusCode: 1002 });
                }
                const valiPassword = await bcrypt.compare(password, user.password);
                if (!valiPassword) {
                    return res.status(404).json({ message: MSG_WRONG_PASSWORD, status: false, statusCode: 1003 });
                }
                if (user && valiPassword) {
                    const accessToken = UserController.generateAccessToken(user);
                    const refreshToken = UserController.generateRefreshToken(user);
                    user.refreshToken = refreshToken;
                    await user.save()
                        .then((data) => {
                            const { password, isAdmin, __v, ...others } = user._doc;
                            return res.status(200).json({
                                message: MSG_LOGIN_SUCCESS,
                                data: { ...others },
                                token: accessToken,
                                status: true
                            });
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_LOGIN_FAIL,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message
                            });
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
            next(err);
        }
    },

    requestRefreshToken: async (req, res, next) => {
        try {
            let refreshToken = req.body.refreshToken;
            if (refreshToken !== null && refreshToken !== '') {
                const customers = await User_Provider.find();
                const customer = customers.find(x => x.refreshToken === refreshToken);
                if (customer) {
                    let newAccessToken = UserController.generateAccessToken(customer);
                    let newRefreshToken = UserController.generateRefreshToken(customer);
                    customer.refreshToken = newRefreshToken;
                    await customer.save()
                        .then((data) => {
                            return res.status(201).json({
                                message: MSG_UPDATE_SUCCESSFULLY,
                                accessToken: newAccessToken,
                                refreshToken: newRefreshToken,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_UPDATE_FAILURE,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message
                            })
                        })
                }
                else {
                    return res.status(409).json({
                        message: MSG_GET_DETAIL_FAILURE,
                        status: false,
                        statusCode: 900
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: MSG_ENTER_ALL_FIELDS,
                    status: false,
                    statusCode: 1005
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

    searchBNPL: async (req, res, next) => {
        try {
            let search = req.query.search;
            let value = req.query.value;
            let from = req.query.from;
            let to = req.query.to;
            let personals = await Bnpl_Personal.find();
            let customers = await Bnpl_Customer.find();
            if (personals && customers && search !== "" && search !== null && search !== undefined && ((value !== "" && value !== null) || (from !== "" && from !== null && to !== "" && to !== null))) {
                let result = [];
                let data = null;
                let step = null;
                if (search === "name") {
                    result = personals.filter(x => x.name.toLowerCase() === value.toLowerCase());
                }
                else if (search === "phone") {
                    result = personals.filter(x => x.phone === value);
                }
                else if (search === "citizenId") {
                    result = personals.filter(x => x.citizenId === value);
                }
                else if (search === "step") {
                    let steps = customers.filter(x => x.step === Number(value));
                    let arrStep = [];
                    steps.map((item, index) => {
                        let { deleted, refreshToken, loginAttempts, pin, __v, ...others } = item._doc;
                        arrStep.push({ ...others });
                    });
                    personals.map(x => {
                        arrStep.map(y => {
                            if (x.phone === y.phone) {
                                result.push(x);
                            }
                        })
                    });
                }
                else if (search === "createdAt") {
                    result = await Bnpl_Personal.find({ createdAt: { $gte: from, $lte: (to + 'T23:59:59.999Z') } });
                }
                data = customers.filter(y => result.map(item => {
                    if (y.phone === item.phone) {
                        step = y.step;
                    }
                }));
                if (result.length > 0) {
                    return res.status(200).json({
                        search: search,
                        count: result.length,
                        message: MSG_GET_DETAIL_SUCCESS,
                        data: {
                            result,
                            step: step
                        },
                        status: true
                    })
                }
                else {
                    return res.status(404).json({
                        search: search,
                        count: result.length,
                        message: MSG_DATA_NOT_FOUND,
                        data: [],
                        status: false,
                        statusCode: 900
                    })
                }
            }
            else {
                return res.status(200).json({
                    data: [],
                    status: true,
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    searchEAP: async (req, res, next) => {
        try {
            let search = req.query.search;
            let value = req.query.value;
            let from = req.query.from;
            let to = req.query.to;
            let customers = await Eap_Customer.find();
            if (customers && search !== "" && search !== null && ((value !== "" && value !== null) || (from !== "" && from !== null && to !== "" && to !== null))) {
                let result = null;
                if (search === "name") {
                    result = customers.filter(x => x.username.toLowerCase() === value.toLowerCase());
                }
                else if (search === "phone") {
                    result = customers.filter(x => x.phone === value);
                }
                else if (search === "email") {
                    result = customers.filter(x => x.email.toLowerCase() === value.toLowerCase());
                }
                else if (search === "createdAt") {
                    result = await Eap_Customer.find({ createdAt: { $gte: from, $lte: (to + 'T23:59:59.999Z') } });
                }
                if (result.length > 0) {
                    return res.status(200).json({
                        search: search,
                        count: result.length,
                        message: MSG_GET_DETAIL_SUCCESS,
                        data: result,
                        status: true
                    })
                }
                else {
                    return res.status(404).json({
                        search: search,
                        count: result.length,
                        message: MSG_DATA_NOT_FOUND,
                        data: [],
                        status: false,
                        statusCode: 900
                    })
                }
            }
            else {
                return res.status(200).json({
                    data: [],
                    status: true,
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    search: async (req, res, next) => {
        try {
            let filters = req.query;
            if ((filters.username !== null && filters.username !== undefined) || (filters.email !== null && filters.email !== undefined) || (filters.phone !== null && filters.phone !== undefined) || (filters.name !== null && filters.name !== undefined) || (filters.citizenId !== null && filters.citizenId !== undefined)) {
                let from = new Date(filters.from);
                let to = new Date(filters.to + 'T23:59:59.999Z');
                let user_eaps = await Eap_Customer.find({ createdAt: { $gte: from, $lte: to } });
                let user_bnpls = await Bnpl_Personal.find({ createdAt: { $gte: from, $lte: to } });

                let RESPONSE_DATA_NULL = {
                    message: MSG_LIST_IS_EMPTY,
                    data: {
                        BNPL: [],
                        EAP: [],
                    },
                    status: true
                }

                let RESPONSE_DATA_FAILURE = {
                    message: MSG_GET_DETAIL_FAILURE,
                    data: {
                        BNPL: [],
                        EAP: [],
                    },
                    status: false,
                    statusCode: 900
                }

                let user_eap_ref = [];
                let user_bnpl_ref = [];
                let user_eap = [];
                let user_bnpl = [];
                let user_eap_arr = [];
                let user_bnpl_arr = [];

                if (user_eaps.length > 0 || user_bnpls.length > 0) {
                    if ((filters.username !== null && filters.username !== undefined) || (filters.email !== null && filters.email !== undefined) || (filters.phone !== null && filters.phone !== undefined)) {
                        user_eap = user_eaps;
                        user_eap = (filters.username !== null && filters.username !== undefined) ? user_eap.filter(obj => obj.username.toLowerCase().trim() === filters.username.toLowerCase().trim()) : user_eap;
                        user_eap = (filters.email !== null && filters.email !== undefined) ? user_eap.filter(obj => obj.email === filters.email) : user_eap;
                        user_eap = (filters.phone !== null && filters.phone !== undefined) ? user_eap.filter(obj => obj.phone === filters.phone) : user_eap;
                        if (user_eap.length > 0) {
                            user_eap.map((user, index) => {
                                let { password, isAdmin, __v, ...others } = user._doc;
                                user_eap_arr.push({ ...others });
                            })
                            if (user_eap_arr.length > 0) {
                                user_bnpl_ref = user_bnpls.filter(x => x.phone === user_eap_arr[0].phone);
                                if (user_bnpl_ref.length > 0) {
                                    let { providers, items, tenor, credit_limit, __v, ...others } = user_bnpl_ref[0]._doc;
                                    user_bnpl_ref = { ...others };
                                }
                                else {
                                    user_bnpl_ref = [];
                                }
                            }
                        }
                    }

                    if ((filters.name !== null && filters.name !== undefined) || (filters.phone !== null && filters.phone !== undefined) || (filters.citizenId !== null && filters.citizenId !== undefined)) {
                        user_bnpl = user_bnpls;
                        user_bnpl = (filters.name !== null && filters.name !== undefined) ? user_bnpl.filter(obj => obj.name.toLowerCase().trim() === filters.name.toLowerCase().trim()) : user_bnpl;
                        user_bnpl = (filters.phone !== null && filters.phone !== undefined) ? user_bnpl.filter(obj => obj.phone === filters.phone) : user_bnpl;
                        user_bnpl = (filters.citizenId !== null && filters.citizenId !== undefined) ? user_bnpl.filter(obj => obj.citizenId === filters.citizenId) : user_bnpl;
                        if (user_bnpl.length > 0) {
                            user_bnpl.map((user, index) => {
                                let { providers, items, tenor, credit_limit, __v, ...others } = user._doc;
                                user_bnpl_arr.push({ ...others });
                            })
                            if (user_bnpl_arr.length > 0) {
                                user_eap_ref = user_eaps.filter(x => x.phone === user_bnpl_arr[0].phone);
                                if (user_eap_ref.length > 0) {
                                    let { __v, password, ...others } = user_eap_ref[0]._doc;
                                    user_eap_ref = { ...others };
                                }
                                else {
                                    user_eap_ref = [];
                                }
                            }
                        }
                    }

                    let data1 = user_bnpl.length > 0 ? user_bnpl_arr : user_bnpl_ref;
                    let data2 = user_eap.length > 0 ? user_eap_arr : user_eap_ref;

                    let isOk = false;

                    if (data1 !== null && data2 !== null && data1.length > 0 && data2.length > 0) {
                        isOk = data1.map((dt1) => data2.map((dt2) => dt1.phone === dt2.phone));
                        isOk = isOk[0][0];
                    }
                    if (user_eap.length > 0 || user_bnpl.length > 0) {
                        if (isOk === true) {
                            return res.status(200).json({
                                message: MSG_GET_DETAIL_SUCCESS,
                                data: {
                                    BNPL: data1,
                                    EAP: data2,
                                },
                                status: true
                            })
                        }
                        else if (((data1 !== null && data1.length > 0) || (data2 !== null && data2.length > 0)) && isOk === false) {
                            return res.status(200).json({
                                message: MSG_GET_DETAIL_SUCCESS,
                                data: {
                                    BNPL: data1,
                                    EAP: data2,
                                },
                                status: true
                            })
                        }
                        else {
                            return res.status(404).json(RESPONSE_DATA_FAILURE)
                        }
                    }
                    else if (user_eap.length === 0 && user_bnpl.length === 0) {
                        return res.status(404).json(RESPONSE_DATA_FAILURE)
                    }
                }
                else if (user_eaps.length === 0 && user_bnpls.length === 0) {
                    return res.status(200).json(RESPONSE_DATA_NULL)
                }
            }
            else {
                return res.status(200).json(RESPONSE_DATA_NULL)
            }
        }
        catch (err) {
            next(err);
        }
    },

    // For QA AND BA, DEV Test
    deleteAccountBNPL: async (req, res, next) => {
        try {
            let phone = req.body.phone;
            if (phone !== null && phone != '') {
                const auths = await Bnpl_Customer.find();
                const auth = auths.find(x => x.phone === phone);
                if (auth) {
                    await auth.deleteOne()
                        .then(() => {
                            return res.status(201).json({
                                message: `Delete user with ${phone} successfully`,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: `Delete user with ${phone} failure`,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(404).json({
                        message: "User is not exists !",
                        status: false,
                    })
                }
                const users = await Bnpl_Personal.find();
                const user = users.find(x => x.phone === phone);
                if (user) {
                    await user.deleteOne()
                        .then(() => {
                            return res.status(201).json({
                                message: `Delete user with ${phone} successfully`,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: `Delete user with ${phone} failure`,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(404).json({
                        message: "User is not exists !",
                        status: false,
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Please enter your phone you want to delete !",
                    status: false
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    deleteAccountEAP: async (req, res, next) => {
        try {
            let phone = req.body.phone;
            if (phone !== null && phone != '') {
                const users = await Eap_Customer.find();
                const user = users.find(x => x.phone === phone);
                if (user) {
                    await user.deleteOne()
                        .then(() => {
                            return res.status(201).json({
                                message: `Delete user with ${phone} successfully`,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: `Delete user with ${phone} failure`,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(404).json({
                        message: "User is not exists !",
                        status: false,
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Please enter your phone you want to delete !",
                    status: false
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    // Soft Delete
    deleteSoftBNPL: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                const user = await Bnpl_Customer.findById(id);
                if (user !== null) {
                    await Bnpl_Customer.delete({ _id: id })
                        .then(() => {
                            return res.status(201).json({
                                message: MSG_DELETE_SUCCESS,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_DELETE_FAIL,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(400).json({
                        message: MSG_GET_DETAIL_FAILURE,
                        status: false,
                        statusCode: 900
                    })
                }
            }
        }
        catch (err) {
            next(err);
        }
    },

    deleteSoftEAP: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                const user = await Eap_Customer.findById(id);
                if (user !== null) {
                    await Eap_Customer.delete({ _id: id })
                        .then(() => {
                            return res.status(201).json({
                                message: MSG_DELETE_SUCCESS,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_DELETE_FAIL,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(400).json({
                        message: MSG_GET_DETAIL_FAILURE,
                        status: false,
                        statusCode: 900
                    })
                }
            }
        }
        catch (err) {
            next(err);
        }
    },

    // Force Delete
    deleteForceBNPL: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await Bnpl_Customer.findByIdAndDelete(id)
                    .then(() => {
                        return res.status(201).json({
                            message: MSG_DELETE_SUCCESS,
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: MSG_DELETE_FAIL,
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    deleteForceEAP: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await Eap_Customer.findByIdAndDelete(id)
                    .then(() => {
                        return res.status(201).json({
                            message: MSG_DELETE_SUCCESS,
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: MSG_DELETE_FAIL,
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    // Restore
    restoreBNPL: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await Bnpl_Customer.restore({ _id: id })
                    .then(() => {
                        return res.status(201).json({
                            message: MSG_RESTORE_SUCCESS,
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: MSG_RESTORE_FAIL,
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    restoreEAP: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await Eap_Customer.restore({ _id: id })
                    .then(() => {
                        return res.status(201).json({
                            message: MSG_RESTORE_SUCCESS,
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: MSG_RESTORE_FAIL,
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: MSG_GET_DETAIL_FAILURE,
                    status: false,
                    statusCode: 900
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    // Trash
    getAllTrashBNPL: async (req, res, next) => {
        try {
            const users = await Bnpl_Customer.findDeleted();
            const trashUsers = users.filter(x => x.deleted === Boolean(true));
            let result = [];
            trashUsers.map((user, index) => {
                let { pin, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (trashUsers.length > 0) {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllTrashEAP: async (req, res, next) => {
        try {
            const users = await Eap_Customer.findDeleted();
            const trashUsers = users.filter(x => x.deleted === Boolean(true));
            let result = [];
            trashUsers.map((user, index) => {
                let { password, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (trashUsers.length > 0) {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: result,
                    message: MSG_GET_LIST_SUCCESSFULLY,
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: null,
                    message: MSG_LIST_IS_EMPTY,
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    /*
    * Report BNPL Registrations
    * By UNO TRUNG
    * 28-04-2022
    */

    getReportBNPL: async (req, res, next) => {
        try {
            let allBnpl = await Bnpl_Customer.find({ "step": { "$not": { "$all": [4] } } });
            return res.status(200).json({
                status: true,
                data: {
                    total: allBnpl.length,
                    step2: allBnpl.filter(x => x.step == 2).length,
                    step3: allBnpl.filter(x => x.step == 3).length,
                    step4: allBnpl.filter(x => x.step == 4).length,
                }
            });
        }
        catch (err) {
            next(err);
        }
    },

    logout: async (req, res, next) => {
        try {
            let id = req.body.id;
            if (id !== null && id !== '') {
                const customers = await User_Provider.find();
                const customer = customers.find(x => x.id === id);
                if (customer) {
                    customer.refreshToken = null;
                    await customer.save()
                        .then((data) => {
                            return res.status(201).json({
                                message: MSG_LOG_OUT_SUCCESS,
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: MSG_LOG_OUT_FAIL,
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message
                            })
                        })
                }
                else {
                    return res.status(409).json({
                        message: MSG_GET_DETAIL_FAILURE,
                        status: false,
                        statusCode: 900
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: MSG_ENTER_ALL_FIELDS,
                    status: false,
                    statusCode: 1005
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

}

module.exports = UserController;