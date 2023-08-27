const mongoose = require('mongoose');

const adminInfoSchema = new mongoose.Schema(
    {
        name: String,
        email: {type: String, unique: true},
        password: String
    },
    {
        collection: 'adminInfo'
    }
);

module.exports = mongoose.model('adminInfo', adminInfoSchema);