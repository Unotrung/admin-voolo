const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Bnpl_CustomerSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }

});

module.exports = mongoose.model('Bnpl_Customer', Bnpl_CustomerSchema);