const User = require("../models/user");

exports.addUser = (req,res) => {
    User.findOne({phoneNumber : req.body.phoneNumber})
    .then(data => {
        if(data){
            res.status(200).json({
                message : "Phone Number Already Registered"
            })
        } else {
            const newMedicineList = [...req.body.medicines];
            const userData = new User({
                name: req.body.name,
                phoneNumber : req.body.phoneNumber,
                medicines : newMedicineList,
                opted : true
            })
            userData
            .save()
            .then(data => {
                res.status(201).json({
                    message : "Data Saved"
                });
            })
            .catch(err => {
                res.status(500).json({
                    message : err
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        });
    })
}

exports.deleteUser = (req,res) => {
    const phoneNumber = req.body.phoneNumber;
    User.deleteOne({phoneNumber : phoneNumber})
    .then(data => {
        res.status(200).json({
            message : "User Deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        });
    })
}

exports.editPhoneNumber = (req,res) => {
    const oldPhoneNum = req.body.oldNum;
    const newPhoneNum = req.body.newPhoneNum;
    User.findOne({phoneNumber : oldPhoneNum})
    .then(data => {
        if(data){
            data.phoneNumber = newPhoneNum;
            data.save()
            .then(data => {
                res.status(200).json({
                    message : "Phone Number Updated"
                })
            })
            .catch(err => {
                res.status(500).json({
                    message : "Error Saving PhoneNumber"
                })
            })
        } else {
            res.status(200).json({
                message : "Old Phone Number Not Registered"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.editUser = (req,res) => {
    const phoneNumber = req.body.phoneNumber;
    User.findOne({phoneNumber : phoneNumber})
    .then(data => {
        if(data){
            const newMedicineList = [...req.body.medicines];
            data.name = req.body.name; 
            data.medicines = newMedicineList;
            data.save()
            .then(data => {
                res.status(200).json({
                    message : "Data Updated"
                })
            })
            .catch(err => {
                res.status(200).json({
                    message : "Data Not Updated"
                })
            })
        } else {
            res.status(200).json({
                message : "No User Found"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.getAllUsers = (req,res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    User.find().then(data => totalLength = data.length)
    .then(() => {
        User.find().limit(limit).skip((pages-1)*limit)
        .then(data => {
            res.status(200).json({
                message : "Data Fetched",
                totalLength : totalLength,
                arrayList : data
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })  
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.searchByUserName = (req,res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    User.find().then(data => totalLength = data.length)
    .then(() => {
        User.find({name : {$regex : req.query.name}}).limit(limit).skip((pages-1)*limit)
        .then(data => {
            res.status(200).json({
                message : "Data Fetched",
                totalLength,
                arrayList : data
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}