const User = require('../models/User');
const Customer = require('../models/Bnpl_Customer');
const bcrypt = require('bcrypt');

const UserController = {

    getAllBNPL: async (req, res, next) => {
        try {
            const users = await User.find();
            if (users.length > 0) {
                return res.status(200).json({
                    count: users.length,
                    data: users,
                    message: "Get list user bnpl success",
                    status: true
                })
            }
            else {
                return res.status(200).json({
                    count: 0,
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
            if (username !== "" && username !== null && password !== "" && password !== null) {
                const users = await User.find();
                const user = users.find(x => x.username === username);
                if (!user) {
                    const salt = await bcrypt.genSalt(10);
                    const hashed = await bcrypt.hash(password, salt);
                    const user = await new User({ username: username, password: hashed, isAdmin: true });
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
                const users = await User.find();
                const user = users.find(x => x.username === username);
                if (!user) {
                    return res.status(404).json({ message: "Wrong username. Please try again !", status: false });
                }
                const valiPassword = await bcrypt.compare(password, user.password);
                if (!valiPassword) {
                    return res.status(404).json({ message: "Wrong password. Please try again !", status: false });
                }
                if (user && valiPassword) {
                    const { password, ...others } = user._doc;
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
        const customers = await Customer.find();
        const search = req.query.search;
        if (search !== "" && search !== null) {
            const data = customers.find(x => x.name === search || x.phone === search || x.createdAt === search);
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

}

module.exports = UserController;