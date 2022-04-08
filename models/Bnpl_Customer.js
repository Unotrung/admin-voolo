const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
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

const secret = process.env.SECRET_MONGOOSE;
Bnpl_CustomerSchema.plugin(encrypt, { secret: secret, encryptedFields: ['Name Phone'] });

module.exports = mongoose.model('Bnpl_Customer', Bnpl_CustomerSchema);