const User_Provider = require('../models/User_Provider');
const Bnpl_Personal = require('../models/Bnpl_Personals');
const Eap_Customer = require('../models/EAP_Customer');
const Bnpl_Customer = require('../models/Bnpl_Customer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const sendMail = require('../helpers/sendMail');
const { } = require('');

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
                    message: "Get list user eap success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: "List user eap is empty ",
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
            console.log("Users: ", users);
            let result = [];
            users.map((user, index) => {
                let { pin, __v, ...others } = user._doc;
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
                    message: "List user bnpl is empty ",
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
                    message: "Get list user bnpl success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: users.length,
                    data: null,
                    message: "List user bnpl is empty ",
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
            let filters = req.query;
            console.log("Filters: ", filters);
            if ((filters.username !== null && filters.username !== undefined) || (filters.email !== null && filters.email !== undefined) || (filters.phone !== null && filters.phone !== undefined) || (filters.name !== null && filters.name !== undefined) || (filters.citizenId !== null && filters.citizenId !== undefined)) {
                let user_eaps = await Eap_Customer.find();
                let user_bnpls = await Bnpl_Personal.find();

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
                                    user_bnpl_ref.push({ ...others });
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
                                    user_eap_ref.push({ ...others });
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
                                message: "Get customer successfully",
                                data: {
                                    BNPL: data1,
                                    EAP: data2,
                                },
                                status: true,
                                draw: 1,
                                recordsTotal: 1,
                                recordsFiltered: 1,
                                input: {}
                            })
                        }
                        else if (((data1 !== null && data1.length > 0) || (data2 !== null && data2.length > 0)) && isOk === false) {
                            return res.status(200).json({
                                message: "Get customer successfully",
                                data: {
                                    BNPL: data1,
                                    EAP: data2,
                                },
                                status: true,
                                draw: 1,
                                recordsTotal: 1,
                                recordsFiltered: 1,
                                input: {}
                            })
                        }
                        else {
                            return res.status(404).json({
                                message: "Can not find any user",
                                data: {
                                    BNPL: [],
                                    EAP: [],
                                },
                                status: true,
                                draw: 1,
                                recordsTotal: 1,
                                recordsFiltered: 1,
                                input: {}
                            })
                        }
                    }
                    else if (user_eap.length === 0 && user_bnpl.length === 0) {
                        return res.status(404).json({
                            message: "Can not find any user",
                            data: {
                                BNPL: [],
                                EAP: [],
                            },
                            status: true,
                            draw: 1,
                            recordsTotal: 1,
                            recordsFiltered: 1,
                            input: {}
                        })
                    }
                }
                else if (user_eaps.length === 0 && user_bnpls.length === 0) {
                    return res.status(200).json({
                        message: "List user eap and list user bnpl is empty",
                        data: {
                            BNPL: [],
                            EAP: [],
                        },
                        status: true,
                        draw: 1,
                        recordsTotal: 1,
                        recordsFiltered: 1,
                        input: {}
                    })
                }
            }
            else {
                return res.status(200).json({
                    message: "List user eap and list user bnpl is empty",
                    data: {
                        BNPL: [],
                        EAP: [],
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
                        message: "Can not find user to delete !",
                        status: false,
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to delete user !",
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
                })
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
                        message: "Can not find user to delete !",
                        status: false,
                    })
                }
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to delete user !",
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
                })
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
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
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
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
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
                            message: "Restore user successfully",
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: "Restore user failure",
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to restore user !",
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
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
                            message: "Restore user successfully",
                            status: true
                        })
                    })
                    .catch((err) => {
                        return res.status(409).json({
                            message: "Restore user failure",
                            status: false,
                            errorStatus: err.status || 500,
                            errorMessage: err.message,
                        })
                    })
            }
            else {
                return res.status(400).json({
                    message: "Can not find id to restore user !",
                    status: false,
                    errorStatus: err.status || 500,
                    errorMessage: err.message,
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
                    message: "Get list user bnpl in trash success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: null,
                    message: "List user bnpl in trash is empty ",
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
                    message: "Get list user eap in trash success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: trashUsers.length,
                    data: null,
                    message: "List user eap in trash is empty ",
                    status: true
                })
            }
        }
        catch (err) {
            next(err);
        }
    },
}

module.exports = UserController;