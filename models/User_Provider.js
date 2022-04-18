const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dotenv = require('dotenv');
const mongooseDelete = require('mongoose-delete');

dotenv.config();

const user_providerSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },

}, { timestamps: true });

mongoose.SchemaTypes.String.set('trim', true);

const secret = process.env.SECRET_MONGOOSE;
user_providerSchema.plugin(encrypt, { secret: secret, encryptedFields: ['username', 'password'] });

// Add plugin
user_providerSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' }); // Soft Delete

module.exports = mongoose.model('user_provider', user_providerSchema);