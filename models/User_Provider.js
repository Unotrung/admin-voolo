const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dotenv = require('dotenv');

dotenv.config();

const User_ProviderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean
    }
}, { timestamps: true });

mongoose.SchemaTypes.String.set('trim', true);

const secret = process.env.SECRET_MONGOOSE;
User_ProviderSchema.plugin(encrypt, { secret: secret, encryptedFields: ['username', 'password'] });

module.exports = mongoose.model('User_Provider', User_ProviderSchema);