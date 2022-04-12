const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const format = require('date-format');
const createError = require('http-errors');
const nodemailer = require("nodemailer");
const userRoute = require('./routers/UserRouter');

dotenv.config();

const app = express();

app.use(morgan('combined'));

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, function (err) {
    if (!err) {
        console.log('Connect MongoDB Successfully');
    }
    else {
        console.log('Connect MongoDB Failure');
    }
}
)

const username = "liverpoolkien911@gmail.com";
const password = "liverpoolkien123";

app.post("/sendMail", async (req, res) => {
    const email = req.body.email;

    let transporter = nodemailer.createTransport({
        service: "smtp.gmail.com",
        auth: {
            user: username,
            pass: password,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    let mailOptions = {
        from: username,
        to: email,
        subject: "Hello ✔",
        text: "Hello Nguyen Trung Kien",
        html: "<b>Hello Nguyen Trung Kien</b>",
    }

    await transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return res.status(500).json({
                message: `Fail to send email to ${email}!`,
                status: false,
                err: err
            });
        }
        else {
            return res.status(500).json({
                message: `Success to send email to ${email}!`,
                status: true,
            });
        }
    });
})

app.use('/v1/admin', userRoute);

app.use((req, res, next) => {
    next(createError.NotFound('This route dose not exists !'));
})

app.use((err, req, res, next) => {
    return res.json({
        status: err.status || 500,
        message: err.message
    })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`);
})