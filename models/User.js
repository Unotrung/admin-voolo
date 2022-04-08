const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is already exists']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, { timestamps: true });

mongoose.SchemaTypes.String.set('trim', true);

const secret = process.env.SECRET_MONGOOSE;
UserSchema.plugin(encrypt, { secret: secret, encryptedFields: ['username password'] });

module.exports = mongoose.model('User', UserSchema);