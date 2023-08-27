const user = require('../models/user');

exports.addUser = (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    user.findOne({ phoneNumber: phoneNumber })
        .then(data => {
            if (data) {
                res.status(200).json({ message: 'Phone number already registered' });
            } else {
                const newMedicineList = [...req.body.medicines];
                const userData = new user({
                    name: req.body.name,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    medicines: newMedicineList,
                    opted: true
                });
                userData.save()
                    .then(data => {
                        res.status(200).json({ message: 'Data saved' });
                    }).catch(err => {
                        res.status(500).json({ message: err });
                    });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
}

exports.deleteUser = (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    user.deleteOne({ phoneNumber: phoneNumber })
        .then(data => {
            res.status(200).json({ message: 'User deleted' });
        }).catch(err => {
            res.status(500).json({ message: err });
        });
}

exports.editUser = (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    user.findOne({ phoneNumber: phoneNumber })
        .then(data => {
            if (data) {
                const newMedicineList = [...req.body.medicines];
                data.name = req.body.name;
                data.medicines = newMedicineList;
                data.save()
                    .then(data => {
                        res.status(200).json({ message: 'Data updated' });
                    }).catch(err => {
                        res.status(200).json({ message: 'Data not updated' });
                    });
            } else {
                res.status(200).json({ message: 'No user found' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
}

exports.editPhoneNumber = (req, res) => {
    const oldPhoneNum = req.body.oldNum;
    const newPhoneNum = req.body.newPhoneNum;
    user.findOne({ phoneNumber: oldPhoneNum })
        .then(data => {
            if (data) {
                data.phoneNumber = newPhoneNum;
                data.save()
                    .then(data => {
                        res.status(200).json({ message: 'Phone number updated' });
                    }).catch(err => {
                        res.status(500).json({ message: 'Error saving phone number' });
                    });
            } else {
                res.status(200).json({ message: 'Old phone number not registered' });
            }
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
}

exports.getAllUsers = (req, res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    user.find().then(data => totalLength = data.length)
        .then(() => {
            user.find().limit(limit).skip((pages - 1) * limit)
                .then(data => {
                    res.status(200).json({
                        message: 'Data fetched',
                        totalLength: totalLength,
                        arrayList: data
                    });
                }).catch(err => {
                    res.status(500).json({ message: 'Server error' });
                });
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
}

exports.searchByUserName = (req, res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    user.find().then(data => totalLength = data.length)
        .then(() => {
            user.find({ name: { $regex: req.query.name } }).limit(limit).skip((pages - 1) * limit)
                .then(data => {
                    res.status(200).json({
                        message: 'Data fetched',
                        totalLength,
                        arrayList: data
                    });
                }).catch(err => {
                    res.status(500).json({ message: 'Server error' });
                });
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
}