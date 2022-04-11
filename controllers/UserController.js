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
                const user = users.find(x => x.username === username);
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
                const user = users.find(x => x.username === username);
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
            const customers = await Bnpl_Personal.find();
            const search = req.query.search;
            if (search !== "" && search !== null) {
                const data = customers.find(x => x.name === search || x.phone === search || x.createdAt === search);
                console.log("Search: ", search);
                console.log("Data: ", data);
                if (data) {
                    return res.status(200).json({
                        message: "Get customer successfully !",
                        data: data,
                        status: true
                    })
                }
                else {
                    return res.status(404).json({
                        message: "Can not find customer !",
                        status: false
                    })
                }
            }
            else {
                return res.status(404).json({
                    message: "Please enter keyword to search !",
                    status: false
                })
            }
        }
        catch (err) {
            next(err);
        }
    }

}

module.exports = UserController;