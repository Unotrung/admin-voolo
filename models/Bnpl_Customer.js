const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dotenv = require('dotenv');

dotenv.config();

const Bnpl_PersonalSchema = new mongoose.Schema({
});

const secret = process.env.SECRET_MONGOOSE;
Bnpl_PersonalSchema.plugin(encrypt, { secret: secret, encryptedFields: ['name', 'phone', 'citizenId', 'name_ref', 'phone_ref'] });

module.exports = mongoose.model('Bnpl_Personal', Bnpl_PersonalSchema);