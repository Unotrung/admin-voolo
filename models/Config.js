const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, 'Name is required']
    },
    value: {
        type: Boolean,
        required: [true, 'Value is required']
    },

    // false đóng, true mở

}, { timestamps: true });

module.exports = mongoose.model('config', configSchema);