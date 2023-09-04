const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/auth');

router.post('/add-user', userController.addUser);
router.post('/delete-user', userController.deleteUser);
router.post('/edit-user', userController.editUser);
router.post('/edit-phoneno', userController.editPhoneNumber);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/searchByUserName', userController.searchByUserName);

router.get('/test', middleware, function(req, res) {
    res.status(200).send({success:true, msg: 'authenticated'});
});

module.exports = router;