const User_Provider = require('../models/User_Provider');
const Bnpl_Personal = require('../models/Bnpl_Personals');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const UserController = {

    getAllBNPL: async (req, res, next) => {
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
                                err: err,
                                message: "Add user failure",
                                status: false
                            })
                        })
                }
                else {
                    return res.status(400).json({
                        message: "User is already exists",
                        status: true
                    })
                }
            }
            else {
                return res.status(404).json({
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
                return res.status(404).json({
                    message: "Please enter your username and password !",
                    status: false
                })
            }
        }
        catch (err) {
            next(err);
        }
    },

    search: async (req, res, next) => {
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
                    result = await Bnpl_Personal.find({ createdAt: { $gte: new Date(from), $lte: new Date(to) } });
                }
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
                    data: [],
                    status: false,
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
    }

}

module.exports = UserController;