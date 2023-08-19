const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        email: {type: String, unique: true},
        password: String
    },
    {
        collection: 'userInfo',
    }
);

module.exports = mongoose.model('userInfo', userDetailsSchema);