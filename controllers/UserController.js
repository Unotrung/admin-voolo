const User_Provider = require('../models/User_Provider');
const Bnpl_Personal = require('../models/Bnpl_Personals');
const EAP_Customer = require('../models/EAP_Customer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const UserController = {

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
                    message: "Get list user success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: "List user is empty ",
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    getAllBNPL: async (req, res, next) => {
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
                    message: "Get list user bnpl success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: "List user is empty ",
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
            const users = await EAP_Customer.find();
            let result = [];
            users.map((user, index) => {
                let { password, __v, ...others } = user._doc;
                result.push({ ...others });
            })
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: result,
                    message: "Get list user eap success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: "List user is empty ",
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
            const user = await EAP_Customer.findById(req.params.id);
            if (user) {
                const { passsword, __v, ...others } = user._doc;
                return res.status(200).json({
                    message: "Get information of user eap successfully",
                    data: { ...others },
                    status: true
                });
            }
            else {
                return res.status(404).json({
                    message: "This account infomation is not exists !",
                    status: false
                });
            }
        }
        catch (err) {
            next(err);
        }
    },

    getUserBNPL: async (req, res, next) => {
        try {
            const user = await Bnpl_Personal.findById(req.params.id);
            if (user) {
                const { providers, items, tenor, credit_limit, __v, ...others } = user._doc;
                return res.status(200).json({
                    message: "Get information of user bnpl successfully",
                    data: { ...others },
                    status: true
                });
            }
            else {
                return res.status(404).json({
                    message: "This account infomation is not exists !",
                    status: false
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
                                data: {
                                    id: data._id,
                                    username: data.username,
                                },
                                message: "Add user successfully",
                                status: true
                            })
                        })
                        .catch((err) => {
                            return res.status(409).json({
                                message: "Add user failure",
                                status: false,
                                errorStatus: err.status || 500,
                                errorMessage: err.message,
                            })
                        })
                }
                else {
                    return res.status(409).json({
                        message: "User is already exists",
                        status: true
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Please enter your username and password !",
                    status: false
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
                    return res.status(404).json({ message: "Wrong username. Please try again !", status: false });
                }
                const valiPassword = await bcrypt.compare(password, user.password);
                if (!valiPassword) {
                    return res.status(404).json({ message: "Wrong password. Please try again !", status: false });
                }
                if (user && valiPassword) {
                    const { password, isAdmin, __v, ...others } = user._doc;
                    return res.status(200).json({
                        message: "Login successfully",
                        data: { ...others },
                        status: true,
                    });
                }
            }
            else {
                return res.status(400).json({
                    message: "Please enter your username and password !",
                    status: false
                })
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
            let customers = await Bnpl_Personal.find();
            if (customers && search !== "" && search !== null && ((value !== "" && value !== null) || (from !== "" && from !== null && to !== "" && to !== null))) {
                let result = null;
                if (search === "name") {
                    result = customers.filter(x => x.name.toLowerCase() === value.toLowerCase());
                }
                else if (search === "phone") {
                    result = customers.filter(x => x.phone === value);
                }
                else if (search === "createdAt") {
                    result = await Bnpl_Personal.find({ createdAt: { $gte: from, $lte: (to + 'T23:59:59.999Z') } });
                }
                if (result.length > 0) {
                    return res.status(200).json({
                        message: "Get customer successfully",
                        data: result,
                        status: true,
                        draw: 1,
                        recordsTotal: 1,
                        recordsFiltered: 1,
                        input: {}
                    })
                }
                else {
                    return res.status(404).json({
                        message: `This ${search} is not exists !`,
                        data: [],
                        status: true,
                        draw: 1,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        input: {}
                    })
                }
            }
            else {
                return res.status(200).json({
                    data: [],
                    status: true,
                    draw: 1,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    input: {}
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
            let customers = await EAP_Customer.find();
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
                    result = await EAP_Customer.find({ createdAt: { $gte: from, $lte: (to + 'T23:59:59.999Z') } });
                }
                if (result.length > 0) {
                    return res.status(200).json({
                        message: "Get customer successfully",
                        data: result,
                        status: true,
                        draw: 1,
                        recordsTotal: 1,
                        recordsFiltered: 1,
                        input: {}
                    })
                }
                else {
                    return res.status(404).json({
                        message: `This ${search} is not exists !`,
                        data: [],
                        status: true,
                        draw: 1,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        input: {}
                    })
                }
            }
            else {
                return res.status(200).json({
                    data: [],
                    status: true,
                    draw: 1,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    input: {}
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    search: async (req, res, next) => {
        try {
            let name = req.query.name;
            let email = req.query.email;
            let phone = req.query.phone;
            let nid = req.query.nid;

            let user_eap_related = null;
            let user_bnpl_related = null;

            let user_eaps = await EAP_Customer.find();
            let user_bnpls = await Bnpl_Personal.find();

            let user_eap = user_eaps.filter(x => x.email === email || x.phone === phone);
            if (user_eap.length > 0) {
                user_eap_related = user_bnpls.filter(x => x.phone === user_eap.phone);
            }

            let user_bnpl = user_bnpls.filter(x => x.citizenId === nid || x.phone === phone && x.name.toLowerCase() === name.toLowerCase());
            if (user_bnpl.length > 0) {
                user_bnpl_related = user_eaps.filter(x => x.phone === user_bnpl.phone);
            }

            if (user_eap && user_bnpl) {
                return res.status(200).json({
                    message: "Get customer successfully",
                    data: {
                        EAP: user_eap || user_eap_related,
                        BNPL: user_bnpl || user_bnpl_related
                    },
                    status: true,
                    draw: 1,
                    recordsTotal: 1,
                    recordsFiltered: 1,
                    input: {}
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    deleteBNPL: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await Bnpl_Personal.findByIdAndDelete(id)
                    .then(() => {
                        return res.status(201).json({
                            message: "Delete user successfully",
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: "Delete user failure",
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to delete user !",
                    status: true,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    deleteEAP: async (req, res, next) => {
        try {
            let id = req.params.id;
            if (id !== null && id != '') {
                await EAP_Customer.findByIdAndDelete(id)
                    .then(() => {
                        return res.status(201).json({
                            message: "Delete user successfully",
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: "Delete user failure",
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to delete user !",
                    status: true,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

}

module.exports = UserController;