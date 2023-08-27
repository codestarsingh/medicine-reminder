const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String},
        phoneNumber: { type: String, unique: true },
        email: { type: String, unique: true },
        medicines: [{ medicineName: String, dosage: String, days: String }],
        opted: Boolean
    }, 
    {
        collection: 'user'
    }
);

module.exports = mongoose.model('user', userSchema);